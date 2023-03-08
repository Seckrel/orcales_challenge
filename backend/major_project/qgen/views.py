from rest_framework.views import APIView
from rest_framework.response import Response
import pint
import random
import numpy as np
import re
from reportlab.pdfgen import canvas
from django.conf import settings
import os
from io import BytesIO
import zipfile
from django.http import FileResponse, HttpResponse


def unit_to_convert(unit_dim):
    length = ['m', 'km', 'cm', 'mm']
    weight = ['kg', 'g', 'mg', 'ton']
    speed = ['m/s', 'km/hr']
    density = ["kg/m**3", "g/cm**3"]
    time = ["s", "hr", "min"]

    ureg = pint.UnitRegistry()

    length_dim = ureg.meter.dimensionality
    weight_dim = ureg.kg.dimensionality
    time_dim = ureg.s.dimensionality

    speed_dim = ureg.Quantity("m/s").dimensionality
    density_dim = ureg.Quantity("kg/m**3").dimensionality

    if unit_dim == length_dim:
        return random.choice(length)

    if unit_dim == weight_dim:
        return random.choice(weight)

    if unit_dim == speed_dim:
        return random.choice(speed)

    if unit_dim == density_dim:
        return random.choice(density)

    if unit_dim == time_dim:
        return random.choice(time)

    return None


def convert_quantity(quantity, unit):
    ureg = pint.UnitRegistry()
    quantity = ureg.Quantity(quantity)
    converted = quantity.to(unit)

    return round(converted, 4)


def unit_conveter(correct, unit):
    ureg = pint.UnitRegistry()

    quantity_unit = f"{correct}{unit}"

    corrected_quantity_unit = ureg.Quantity(quantity_unit)

    unit_dimension = corrected_quantity_unit.dimensionality
    new_unit = unit_to_convert(unit_dimension)

    new_correct_answer = ""

    if new_unit == None:
        new_correct_answer = corrected_quantity_unit
    else:
        new_correct_answer = convert_quantity(quantity_unit, new_unit)

    correct_answer = new_correct_answer

    return correct_answer


def extrac_number(wrong):
    match = re.search(r'\d+\.\d+|\d+', wrong)

    if match:
        num = float(match.group())
        if num.is_integer():
            num = int(num)
        return num

    match = re.search(r'\d+\.\d+|\d+', wrong)


def get_numeric_type(wrong):
    wrong = str(wrong)
    try:
        int(wrong)
        return 1
    except ValueError:
        try:
            float(wrong)
            return 0
        except ValueError:
            return -1


def similarity_transform(n):
    # Convert integer to string
    str_n = str(n)
    # Transform each digit
    transformed_digits = [int(d) + random.randint(-1, 1) for d in str_n]
    # Concatenate the transformed digits
    transformed_str = ''.join(str(d) for d in transformed_digits)
    # Pad the transformed string with leading zeros
    transformed_str = transformed_str.rjust(len(str_n), '0')
    # Convert the transformed string back to an integer
    transformed_n = int(transformed_str)
    return transformed_n


def similarity_transform_float(x):
    # Compute the order of magnitude of x
    num_place = len(str(x).split('.')[-1])
    order = np.floor(np.log10(np.abs(x)))
    # Compute the fractional and integer parts of x
    frac, int_ = np.modf(x / 10 ** order)
    # Transform the fractional part using a normal distribution with mean 0 and standard deviation 0.1
    transformed_frac = frac + np.random.normal(scale=0.1)
    # Clamp the transformed fractional part to the range [0, 1)
    transformed_frac = np.clip(transformed_frac, 0, 1 - 10 ** (-10))
    # Compute the transformed float by adding the transformed fractional and integer parts
    new_int_ = similarity_transform(int(int_))
    transformed_x = (float(new_int_) +
                     transformed_frac) * 10 ** order

    return round(transformed_x, num_place)


def create_pdf(questions):
    pdfs = []
    buffer = BytesIO()

    with zipfile.ZipFile(buffer, "w") as zip_archive:
        for idx, question in enumerate(questions):
            pdf_buffer = BytesIO()

            pdf = canvas.Canvas(pdf_buffer)

            options = [
                question["correct"],
                question["wrong1"],
                question["wrong2"],
                question["wrong3"]
            ]

            random.shuffle(options)

            pdf.setTitle("Questions")

            pdf.drawString(50, 750 - idx*100,
                           f"Question {idx+1}: {question['question']}")

            pdf.drawString(50, 725 - idx*100,
                           f"A: {options[0]}")
            pdf.drawString(220, 725 - idx*100,
                           f"B: {options[1]}")
            pdf.drawString(50, 675 - idx*100,
                           f"C: {options[2]}")
            pdf.drawString(220, 675 - idx*100,
                           f"D: {options[3]}")

            pdf.save()

            pdf_data = pdf_buffer.getvalue()
            pdf_buffer.close()
            zip_archive.writestr(f"question{idx+1}.pdf", pdf_data)

    zip_data = buffer.getvalue()
    buffer.close()
    return zip_data

    for idx, question in enumerate(questions):
        # loc_to_pdf = os.path.join(
        #     settings.BASE_DIR, "pdfs", f"questions{idx+1}.pdf")
        # pdf = canvas.Canvas(loc_to_pdf)

        # pdf.setTitle("Questions")

        # pdf.drawString(50, 750 - idx*100,
        #                f"Question {idx+1}: {question['question']}")
        buffer = BytesIO()

        pdf = canvas.Canvas(buffer)

        options = [
            question["correct"],
            question["wrong1"],
            question["wrong2"],
            question["wrong3"]
        ]

        random.shuffle(options)

        pdf.setTitle("Questions")

        pdf.drawString(50, 725 - idx*100,
                       f"A: {options[0]}")
        pdf.drawString(220, 725 - idx*100,
                       f"B: {options[1]}")
        pdf.drawString(50, 675 - idx*100,
                       f"C: {options[2]}")
        pdf.drawString(220, 675 - idx*100,
                       f"D: {options[3]}")

        pdf.save()
        pdfs.append((f"set{idx+1}", buffer.getvalue()))

        buffer.close()

    return pdfs


def create_zip(pdfs):
    buffer = BytesIO()

    # Create a ZipFile object and add each file to it
    with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for file in pdfs:
            file_name, file_data = file
            zip_file.writestr(file_name, file_data)

    # Get the zip archive data from the BytesIO buffer
    zip_data = buffer.getvalue()
    return zip_data


class GeneratePDF(APIView):
    def post(self, request, format=None):
        ureg = pint.UnitRegistry()

        data = request.data

        questions = data["questions"]
        student_no = int(data["studentNo"])

        new_question_set = []

        print("="*4, "working")
        for question in questions:
            for _ in range(student_no):
                # new_question = {"question": question["question"]}
                new_question = dict(question)

                type_ = question["type"]

                if type_ == "text":
                    # pass as text similarity is not implemented
                    new_question_set.append(new_question)
                    continue

                correct_ans = question["correct"]
                unit = question["unit"]
                # unit = ureg(unit) if unit != "none" else unit

                wrongs = [question["wrong1"],
                          question["wrong2"], question["wrong3"]]

                if unit != "none":
                    new_correct = str(unit_conveter(
                        correct_ans, unit)).replace("**", "^")
                    new_question["correct"] = "".join(new_correct.split(" "))

                    for idx, wrong in enumerate(wrongs):
                        wrongs[idx] = f"{wrong}{unit}"

                if type_ == "numeric":
                    list_new_wrongs = []
                    unit = ureg(unit) if unit != "none" else ""

                    for idx, wrong in enumerate(wrongs):

                        while True:

                            wrong_magnitude = extrac_number(str(wrong))

                            numeric_type = get_numeric_type(wrong_magnitude)

                            new_wrong = ""

                            if numeric_type == 1:
                                new_wrong = similarity_transform(
                                    wrong_magnitude)

                            elif numeric_type == 0:
                                new_wrong = similarity_transform_float(
                                    wrong_magnitude)

                            else:
                                list_new_wrongs.append(new_wrong)
                                break

                            if new_wrong == str(correct_ans):
                                continue

                            if idx == 0:
                                list_new_wrongs.append(new_wrong)
                                break

                            if new_wrong in list_new_wrongs:
                                continue
                            else:
                                list_new_wrongs.append(new_wrong)
                                break

                        new_wrong = f"{new_wrong}{unit}".replace(
                            "**", "^")
                        new_wrong = "".join(
                            new_wrong.split(" "))
                        new_question[f"wrong{idx}"] = new_wrong

                new_question_set.append(new_question)

        zip_data = create_pdf(new_question_set)
        response = HttpResponse(zip_data, content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename="questions.zip"'
        return response
        # zip_file = create_zip(pdfs)

        # response = Response(zip_file, content_type='application/zip')
        # response['Content-Disposition'] = 'attachment; filename="question.zip"'

        response = FileResponse(zip_file)
        response['Content-Disposition'] = 'attachment; filename="{0}"'.format(
            "questions.zip")

        return response
