import pint
import random
# dev
import pprint

# Deine unit registry
ureg = pint.UnitRegistry()

dist_conv = {'m': 1, 'km': 1000, 'cm': 0.01, "mm": 0.01}
weight_conv = {'kg': 1000, "g": 1, 'mg': 0.01, 'ton': 10**6}
speed = {'m/s': 1, 'km/h': .277778}
density = {"kg/m^3": 1, "g/cm^3": 1000}

length = ['m', 'km', 'cm', 'mm']
weight = ['kg', 'g', 'mg', 'ton']
speed = ['m/s', 'km/hr']
density = ["kg/m^3"]
time = ["s", "hr", "min"]


def unit_to_convert(unit_dim):
    length_dim = ureg.meter.dimensionality
    weight_dim = ureg.kg.dimensionality
    time_dim = ureg.s.dimensionality

    speed_dim = ureg.Quantity("m/s").dimensionality
    density_dim = ureg.Quantity("kg/m**3").dimensionality

    if unit_dim == length_dim:
        return random.choice(length)

    if unit_dim == weight_dim:
        return random.choice(speed)

    if unit_dim == speed_dim:
        return random.choice(speed_dim)

    if unit_dim == density_dim:
        return random.choice(density)

    if unit_dim == time_dim:
        return random.choice(time)

    return None


# Define function to convert quantity to desired unit
def convert_quantity(quantity, unit):
    quantity = ureg.Quantity(quantity)
    convert_quantity = quantity.to(unit)
    return round(convert_quantity, 4)


# Example
correct_answers = ["12km", "2hr", "100m"]

students = []
for i in range(3):
    new_correct_answers = []
    for correct_answer in correct_answers:
        correct_answer = ureg.Quantity(correct_answer)
        unit_dimension = correct_answer.dimensionality

        new_unit = unit_to_convert(unit_dimension)

        if new_unit == None:
            new_correct_answer = correct_answer
        else:
            new_correct_answer = convert_quantity(correct_answer, new_unit)

        new_correct_answers.append(new_correct_answer)

    students.append({
        "id": i+1,
        "initial_wrong_answer": correct_answers,
        "new_wrong_answer": new_correct_answers
    })

pprint.pprint(students)
