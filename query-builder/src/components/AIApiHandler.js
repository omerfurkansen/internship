const tableSchema = `
  Table Structure:
  - id: bigint
  - date_time: datetime
  - operation_date: datetime
  - action: varchar(31)
  - gateway: varchar(31)
  - username: varchar(31)
  - total: float
  - period: varchar(31)
  - plan: enum ('PREMIUM', 'OLDPREMIUM', 'ECONOMY', 'PROFESSIONAL', 'ENTERPRISE', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'STORAGE')
  - currency: varchar(31)
  - payment_status: varchar(31)
  - subscription_id: varchar(200)
  - invoice_id: varchar(255)
  - amount_paid: float
  - amount_net: float
  - amount_fee: float
  - discount_amount: float
  - tax_amount: float
  - tax_rate: float
  - tax_citycode: varchar(31)
  - tax_meta: text
  - country: varchar(31)
  - state: varchar(31)
  - zip: varchar(10)
  - card_network: varchar(31)
  - card_type: varchar(31)
  - pricing_plan_type: varchar(63)
  - current_discount: varchar(63)
  - process_type: varchar(63)
  - payment_method_id: varchar(50)
  - note: text
  - ip: varchar(200)
`;

const returnValues = `{Suggestion}\n{Suggestion}\n{Suggestion}`;

export async function getSuggestions(userInput = '') {
  const apiKey = 'replace';
  const url = 'https://api.openai.com/v1/chat/completions';

  const prompt = userInput
    ? `You are a database query translator that generates specific and actionable queries in human-readable language, never SQL. Your task is to enhance the given query by adding relevant details to make it more specific and actionable. Format your response strictly as: ${returnValues}, do not ever use different format. Given the following table structure: ${tableSchema}. The user has written: "${userInput}". Suggest three different ways to complete this query by including specific details from the schema. Avoid generic terms and provide actionable details based on the schema.`
    : `You are a database query translator that generates specific and actionable queries in human-readable language, never SQL. Format your response strictly as: ${returnValues}, do not ever use different format. Given the following table structure: ${tableSchema}, suggest three different queries by including specific details from the schema. Avoid generic terms and provide actionable details based on the schema.`

  const data = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: prompt }],
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    response.data = await response.json();

    const suggestions = response.data.choices[0].message.content;
    return suggestions;
  } catch (error) {
    console.error('Error calling the API:', error);
    return "An error occurred while fetching suggestions.";
  }
}

export async function getSuggestionsFromBackend(userInput = '') {
  const url = 'https://b-karaca.jotform.dev/intern-api/querybuilder/suggestion';
  const formData = new FormData();
  formData.append("userInput", userInput);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    response.data = await response.json();

    const suggestions = response.data.content;
    const suggestionsArray = Object.values(suggestions);
    return suggestionsArray;
  } catch (error) {
    console.error('Error calling the API:', error);
    return ["An error occurred while fetching suggestions."];
  }
}

