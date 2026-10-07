# TRAITS.md

## Let your agent get acquainted with you

*Traits* help your agent adapt to you, by using results from a trait test to generate an accurate 
description of your personality. Read on to learn how it works and for steps to use your trait 
data effectively.

### How the test works

The results of the trait test are separated into five factors, known as the "Big Five" personality 
traits (extraversion, agreeableness, conscientiousness, emotional stability, and intellect/imagination).
Each factor percentage is based on how you rank the test statements. These values are passed to a 
local model, using Transformers.js, to generate a description of your personality. Your results are 
saved to a TRAITS.md file that's specific to you.

### Using traits with an agent

Start by saving your TRAITS.md to an agents folder in your home directory (~/.agents), then point 
to it in a global AGENTS.md file. This allows agents you're working with to access and use your 
trait data, shaping its interactions with you to your personality.
