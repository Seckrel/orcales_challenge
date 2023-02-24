import random
import numpy as np
# dev
import pprint

# Sample set of wrong answer
wrong_answers = ['2', '3.5', '0.4']

# number of new wrong answers to generate for each statement
num_new_wrong_answers = 3

# Apply similarity tansformation to generate new wrong answers


def get_numeric_type(string):
    try:
        int(string)
        return 1
    except ValueError:
        try:
            float(string)
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

    return transformed_x


# Generate new wrong answer for each student
try:
    students = []
    for i in range(3):
        # Randomly select an initial wrong answer for the student
        new_wrong_answers = []

        for inital_wrong_answer in wrong_answers:
            # inital_wrong_answer = random.choice(wrong_ans)
            numeric_type = get_numeric_type(inital_wrong_answer)

            if numeric_type == 1:
                num_new_wrong_answers = similarity_transform(
                    inital_wrong_answer)

            elif numeric_type == 0:
                num_new_wrong_answers = similarity_transform_float(
                    float(inital_wrong_answer))

            else:
                raise Exception()

            new_wrong_answers.append(num_new_wrong_answers)

        students.append({
            "id": i+1,
            "initial_wrong_answer": wrong_answers,
            "new_wrong_answer": new_wrong_answers
        })
except Exception:
    print("error")

pprint.pprint(students)
