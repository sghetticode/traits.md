# TRAITS.md

## Let your agent get acquainted with you

*Traits* help your agent adapt to you, by using results from a trait test to generate an accurate 
description of your personality. Read on to learn how it works and for steps to use your trait 
data effectively.

### How the test works

The results of the trait test are separated into five factors, known as the "Big Five" personality
traits (extraversion, agreeableness, conscientiousness, emotional stability, and intellect/imagination). 
Each will have a percentage associated with it based on statements you ranked as either way off, 
inaccurate, neither, accurate, or spot on. These values are passed to an LLM running in the browser to 
generate a description of your personality. Your results are saved to a Markdown file that's specific 
to you.

### Using traits with an agent

First, save your TRAITS.md to an agents folder in your home directory (~/.agents), then point to it in
your global AGENTS.md file. This allows any agent you're working with to access and use your trait data, 
shaping its interactions with you to your personality.
