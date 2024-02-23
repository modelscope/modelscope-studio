FROM python:3.9

WORKDIR /code

COPY --link --chown=1000 . .

RUN mkdir -p /tmp/cache/
RUN chmod a+rwx -R /tmp/cache/
ENV TRANSFORMERS_CACHE=/tmp/cache/

RUN pip install --no-cache-dir -r requirements.txt

ENV PYTHONUNBUFFERED=1 	GRADIO_ALLOW_FLAGGING=never 	GRADIO_NUM_PORTS=1 	GRADIO_SERVER_NAME=0.0.0.0     GRADIO_SERVER_PORT=7860 	SYSTEM=spaces

CMD ["python", "app.py"]
