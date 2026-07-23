import json
import os


FILE_PATH = "investigations.json"


def load_investigations():

    if os.path.exists(FILE_PATH):

        with open(FILE_PATH, "r") as file:

            return json.load(file)

    return []



def save_investigations(data):

    with open(FILE_PATH, "w") as file:

        json.dump(
            data,
            file,
            indent=2
        )



investigations = load_investigations()