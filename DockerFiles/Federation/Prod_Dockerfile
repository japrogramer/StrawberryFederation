FROM python:3.8.3-alpine3.12
COPY ["backend", "/var/www/app"]

ENV STATIC_URL /static
ENV STATIC_PATH /var/www/app/static

WORKDIR /var/www/app
RUN pip install -r requirements.txt

ENTRYPOINT ["ash", "-c"]
CMD ["python app.py"]
