from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import json
import os
from dotenv import load_dotenv
from openai import OpenAI
import google.generativeai as genai
from services.AIClientService import AIClientService
from services.AIImageService import AIImageService
import os
import time

load_dotenv()

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

STORAGE_DIR = os.path.join(os.getcwd(), "data/interviews")
os.makedirs(STORAGE_DIR, exist_ok=True)

image_service = AIImageService(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)
CORS(app)

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "API is working"})

@app.route('/api/config', methods=['GET'])
def get_config():
    """
    Returns the configuration settings for the testing application.
    """
    with open('static_data/config.json', encoding='utf-8') as f:
        config = json.load(f)
    return jsonify(config)

@app.route('/api/evaluate', methods=['POST'])
def evaluate():
    data = request.get_json()

    vacancy_name = data.get("vacancy_name", "")
    vacancy_description = data.get("vacancy_description", "")
    ainame = data.get("ainame", "")
    aimodel = data.get("aimodel", "")
    temperature = data.get("temperature", 0.7)
    maxTokens = data.get("maxTokens", 50)

    prompt_text = (
        "You are an expert HR assistant.\n"
        "Based on the following job description, suggest the appropriate preparation level.\n\n"
        f"Vacancy name: {vacancy_name}\n"
        f"Description: {vacancy_description}\n\n"
        "Possible levels: Junior, Middle, Senior.\n"
        "Answer only with one of these levels."
    )

    print(prompt_text)

    valid_levels = ["Junior", "Middle", "Senior"]

    try:
        text = AIClientService.generate_completion(
            ainame=ainame,
            aimodel=aimodel,
            temperature=temperature,
            maxTokens=maxTokens,
            prompt_text=prompt_text
        )

        if text not in valid_levels:
            return jsonify({
                "error": f"Invalid response from model: '{text}'",
                "raw_response": text
            }), 422

        return jsonify({"suggested_level": text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/start-interview", methods=["POST"])
def start_interview():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        timestamp = str(int(time.time() * 1000))
        filename = f"{timestamp}.json"
        filepath = os.path.join(STORAGE_DIR, filename)

        interviewOptions = {
    "settings": data,
    "questions": []
}

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(interviewOptions, f, ensure_ascii=False, indent=2)

        return jsonify({"timestamp": timestamp}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/question/get-question/<id>", methods=["GET"])
def get_question(id):
    try:
        filename = f"{id}.json"
        filepath = os.path.join(STORAGE_DIR, filename)

        if not os.path.exists(filepath):
            return jsonify({"error": "Interview not found"}), 404

        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        vacancy_name = data['settings'].get("vacancyName", "")
        vacancy_description = data['settings'].get("vacancyDescription", "")
        difficulty = data['settings'].get("selectedDifficulty", "")
        ainame = data['settings'].get("selectedAI", "")
        aimodel = data['settings'].get("selectedAIModel", "")
        temperature = data['settings'].get("temperature", 0.7)
        maxTokens = data['settings'].get("maxTokens", 50)

        prompt_text = (
            "You are an expert HR assistant.\n"
            "Based on the following job description and difficulty level, prepare a question to assess the applicant's knowledge.\n\n"
            f"Vacancy name: {vacancy_name}\n"
            f"Description: {vacancy_description}\n\n"
            f"Difficulty Level: {difficulty}\n\n"
        )

        if data['settings'].get('selectedTestType') == 'single':
            prompt_text += (
                "Additionally, create a single-choice question with exactly 4 answer options.\n"
                "Only ONE of them must be correct.\n"
                "Return the ONLY the one JSON objectstrictly in the following JSON format:\n\n"
                '{\n'
                '  "question": "Your question text",\n'
                '  "answerOptions": [\n'
                '    "Option 1",\n'
                '    "Option 2",\n'
                '    "Option 3",\n'
                '    "Option 4"\n'
                '  ],\n'
                '  "type": "single",\n'
                '  "rightAnswer": "The correct option text exactly as in answerOptions"\n'
                '  "answer": ""\n'
                '}\n'
            )

        print('!!!!!!!!!!!!! prompt_text: ', prompt_text)

        text = AIClientService.generate_completion(
            ainame=ainame,
            aimodel=aimodel,
            temperature=temperature,
            maxTokens=maxTokens,
            prompt_text=prompt_text
        ) 
        print('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        print(text) 
        questionObj = json.loads(text)

        print('-------------------- questionObj', questionObj);  

        question = {
            "id": len(data["questions"]) + 1,
            "question": questionObj["question"],
            "answerOptions": questionObj["answerOptions"],
            "type": "single",
            "rightAnswer": questionObj["rightAnswer"],
            "candidateAnswer": "",
            "point": 0

        }

        if "questions" not in data:
            data["questions"] = []

        data["questions"].append(question)

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        return jsonify({"question": question}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Internal Server Error"}), 500
    
@app.route("/api/question/answer", methods=["POST"])
def save_answer():
    try:
        data = request.get_json()
        interview_id = data.get("interviewId")
        answer = data.get("answer")

        if not interview_id or answer is None:
            return jsonify({"error": "Missing data"}), 400

        filename = f"{interview_id}.json"
        filepath = os.path.join(STORAGE_DIR, filename)

        if not os.path.exists(filepath):
            return jsonify({"error": "Interview not found"}), 404

        with open(filepath, "r", encoding="utf-8") as f:
            interview_data = json.load(f)

        if "questions" in interview_data and interview_data["questions"]:
            interview_data["questions"][-1]["answer"] = answer
            if answer == interview_data["questions"][-1]["rightAnswer"]:
                interview_data["questions"][-1]["point"] = 1
        else:
            return jsonify({"error": "No question to answer"}), 400

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(interview_data, f, ensure_ascii=False, indent=2)


        return jsonify({"status": "Answer saved"}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/interview/get-result/<id>", methods=["GET"])
def get_result(id):
    try:
        filename = f"{id}.json"
        filepath = os.path.join(STORAGE_DIR, filename)

        if not os.path.exists(filepath):
            return jsonify({"error": "Interview not found"}), 404

        with open(filepath, "r", encoding="utf-8") as f:
            interview_data = json.load(f)

        return jsonify(interview_data), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/generate_certificate/<id>", methods=["GET"])
def generate_certificate(id):
    filename = f"{id}.json"
    filepath = os.path.join(STORAGE_DIR, filename)

    if not os.path.exists(filepath):
        return jsonify({"error": "Interview not found"}), 404

    with open(filepath, "r", encoding="utf-8") as f:
        interview_data = json.load(f)

    print(interview_data)

    prompt = 'apple certificate'

    try:
        data = image_service.generate_and_save_certificate(prompt)
        print(data)
        return jsonify({
            "message": "Certificate generated",
            "pdf_path": data["pdf"],
            "img_path": data["img"]
        })
    except Exception as e:
        print("Error generating image:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/generate_image_pdf", methods=["POST"])
def generate_image_pdf():
    data = request.get_json()
    prompt = data.get("prompt", "No prompt provided")

    try:
        pdf_path = image_service.generate_image_and_save_pdf(prompt)
        return jsonify({"message": "PDF generated", "pdf_path": pdf_path})
    except Exception as e:
        print("Error generating image:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/download_pdf/<filename>", methods=["GET"])
def download_pdf(filename):
    pdf_path = os.path.join("data/generated_pdfs", filename)
    if not os.path.isfile(pdf_path):
        return jsonify({"error": "File not found"}), 404
    return send_file(pdf_path, as_attachment=True)


if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', debug=True, port=port)
