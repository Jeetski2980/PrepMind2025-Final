import { RequestHandler } from "express";

export const handleChat: RequestHandler = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Simulate AI responses for different types of questions
    let response = "";

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('sat') || lowerMessage.includes('math') || lowerMessage.includes('algebra')) {
      response = `Absolutely! I'd be happy to help you understand SAT grammar rules. The SAT Writing and Language section specifically tests your understanding of standard written English, which involves several grammar rules and conventions. Here's a breakdown of some important areas to focus on:

### 1. Subject-Verb Agreement
Make sure that subjects and verbs agree in number. If the subject is singular, the verb should be plural, and if the subject is plural, the verb should be singular. Watch out for intervening phrases that can make this tricky.

### 2. Verb Tense
Ensure that verb tenses are consistent throughout a sentence or passage. " Examples: " Examples: " In Examples: " Each bird (singular) flies (singular) south."

### 3. Pronoun Agreement
Ensure that pronouns agree with their antecedents in number and gender. If the antecedent is singular and female, use "she/her"; if it's plural, use "they/them/they're."`;
    } else if (lowerMessage.includes('act') || lowerMessage.includes('science')) {
      response = `Great question about the ACT Science section! Many students find this section challenging, but with the right approach, you can master it. The ACT Science section tests your scientific reasoning skills more than specific science knowledge.

Here are key strategies:

### 1. Focus on Data Interpretation
Most questions ask you to read graphs, charts, and tables. Practice identifying trends, patterns, and relationships in data.

### 2. Don't Get Bogged Down in Details
You don't need extensive background knowledge. Focus on what the passage and data tell you.

### 3. Time Management
You have 35 minutes for 40 questions, so work efficiently. Start with Data Representation passages (they're usually easier).

### 4. Read the Questions First
Sometimes you can answer questions without reading the entire passage - just by looking at the data.

Would you like me to walk through a specific type of science question or explain any particular concept?`;
    } else if (lowerMessage.includes('ap') || lowerMessage.includes('calculus') || lowerMessage.includes('derivative')) {
      response = `Excellent question about AP Calculus! Understanding derivatives is fundamental to success in calculus. Let me break this down step by step:

### What is a Derivative?
A derivative represents the rate of change of a function at any given point. Think of it as the slope of the tangent line to the curve at that point.

### Key Derivative Rules:
1. **Power Rule**: d/dx(x^n) = nx^(n-1)
2. **Product Rule**: d/dx(uv) = u'v + uv'
3. **Chain Rule**: d/dx(f(g(x))) = f'(g(x)) × g'(x)

### Applications:
- Finding velocity from position functions
- Determining maximum and minimum values
- Analyzing concavity and inflection points

### Tips for Success:
- Practice identifying which rule to use
- Always check your work by plugging in values
- Understand the geometric meaning, not just the algebraic manipulation

What specific aspect of derivatives would you like to explore further?`;
    } else if (lowerMessage.includes('help') || lowerMessage.includes('study') || lowerMessage.includes('tips')) {
      response = `I'm here to help you succeed with your test prep! Here are some proven study strategies that work well for SAT, ACT, and AP exams:

### Effective Study Techniques:
1. **Active Practice**: Don't just read - solve problems and take practice tests
2. **Spaced Repetition**: Review material at increasing intervals
3. **Focus on Weaknesses**: Identify your weak areas and spend extra time there
4. **Understand, Don't Memorize**: Focus on concepts rather than rote memorization

### Test-Taking Strategies:
- Read questions carefully before looking at answer choices
- Eliminate obviously wrong answers first
- Manage your time - don't spend too long on any one question
- Trust your first instinct unless you find a clear error

### Specific Prep Recommendations:
- Take full-length practice tests under timed conditions
- Review explanations for both correct and incorrect answers
- Keep a log of mistakes to avoid repeating them

What specific subject or test are you preparing for? I can give you more targeted advice!`;
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = `Hello! I'm your AI tutor, and I'm excited to help you with your test preparation. I can assist you with:

• **SAT prep** - Math, Reading, and Writing sections
• **ACT prep** - All four sections including Science
• **AP exams** - Various subjects including Calculus, Physics, Chemistry, and more

Whether you need help understanding specific concepts, want study strategies, or have questions about test-taking techniques, I'm here to help. 

What would you like to work on today? Feel free to ask me anything about test prep, specific problems, or study strategies!`;
    } else {
      response = `That's a great question! I'm here to help you with test preparation for SAT, ACT, and AP exams. 

To give you the most helpful response, could you tell me a bit more about:
- Which test you're preparing for (SAT, ACT, or specific AP exam)
- What specific topic or concept you'd like help with
- Whether you're looking for study strategies or help with specific problems

I'm designed to provide detailed explanations, study tips, and practice guidance to help you succeed. What would you like to focus on?`;
    }

    res.json({
      success: true,
      response: response
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message'
    });
  }
};
