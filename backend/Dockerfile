FROM python:3.6

COPY . .usr/src/app
WORKDIR .usr/src/app

COPY requirements.txt ./
RUN pip install --trusted-host pypi.org \
        --trusted-host pypi.python.org \
        --trusted-host files.pythonhosted.org \
        --no-cache-dir \
        --upgrade pip
RUN pip install --trusted-host pypi.org \
        --trusted-host pypi.python.org \
        --trusted-host files.pythonhosted.org \
        --no-cache-dir \
        -r requirements.txt

RUN python manage.py drop_db
RUN python manage.py create_db
ENTRYPOINT ["python"]
CMD ["manage.py", "runserver", "--host=0.0.0.0"]

