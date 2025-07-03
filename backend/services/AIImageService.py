import uuid
import os
import requests
from openai import OpenAI
from PIL import Image
from io import BytesIO

class AIImageService:
    def __init__(self, api_key: str, output_dir: str = "static/certificates"):
        self.client = OpenAI(api_key=api_key)
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def generate_and_save_certificate(self, prompt: str, size: str = "1024x1024") -> str:
        """
        Generates an image from a prompt using DALL·E, saves as PDF, returns the PDF path.
        """
        # 1. Request image generation
        response = self.client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            n=1,
            size=size
        )

        image_url = response.data[0].url
        print(f"[AIImageService] Image URL: {image_url}")

        # 2. Download image
        image_resp = requests.get(image_url)
        image_resp.raise_for_status()

        img = Image.open(BytesIO(image_resp.content)).convert("RGB")

        # 3. Save as PDF
        filename = f"{uuid.uuid4().hex}.pdf"
        pdf_path = os.path.join(self.output_dir, filename)
        img.save(pdf_path, "PDF", resolution=100.0)

        # 4. Save PNG (or JPEG) to static/certificat/image
        image_dir = os.path.join("static", "certificates", "images")
        os.makedirs(image_dir, exist_ok=True)

        image_filename = f"{uuid.uuid4().hex}.png"
        image_path = os.path.join(image_dir, image_filename)
        img.save(image_path, format="PNG")
        print(f"[AIImageService] Saved Image: {image_path}")

        print(f"[AIImageService] Saved PDF: {pdf_path}")
        result = {
            "pdf": f"/{pdf_path}",
            "img": f"/{image_path}"
        }
        return result
