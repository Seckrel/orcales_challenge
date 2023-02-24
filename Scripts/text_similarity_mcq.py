import numpy as np

# Define the original wrong answers
wrong_answers = ['string theory', 'theory of everything', 'quantum mechanics']

# Define the range of perturbations
scale = 0.1  # perturb within 10% of the original value

# Perturb the wrong answers
new_wrong_answers = []
for answer in wrong_answers:
    # Convert the answer to a numpy array
    answer_array = np.array(list(answer))
    
    # Generate a random perturbation
    perturbation = np.random.normal(scale=scale, size=answer_array.shape)
    
    # Apply the perturbation to the answer
    transformed_answer_array = answer_array + perturbation
    
    # Convert the transformed array back to a string
    transformed_answer = ''.join(transformed_answer_array)
    
    # Add the transformed answer to the list of new wrong answers
    new_wrong_answers.append(transformed_answer)

print(new_wrong_answers)