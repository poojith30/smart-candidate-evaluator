const API_KEY_STORAGE_KEY = 'ai_candidate_evaluator_gemini_key';

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(API_KEY_STORAGE_KEY) || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
}

export function setStoredApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (key.trim()) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

export function isApiKeyConfigured(): boolean {
  return Boolean(getStoredApiKey());
}

/**
 * Direct fetch execution to Google Gemini REST API.
 * Ensures completely isolated calls with no cross-conversation history.
 */
export async function callGeminiApi(
  systemInstruction: string,
  userPrompt: string,
  responseJson = true
): Promise<string> {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please set an API key in the configuration panel.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload: any = {
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.1, // Low temperature for factual, evidence-grounded responses
      topP: 0.95,
      responseMimeType: responseJson ? 'application/json' : 'text/plain'
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let parsedMsg = errorBody;
    try {
      const errJson = JSON.parse(errorBody);
      parsedMsg = errJson.error?.message || errorBody;
    } catch {
      // use raw text
    }
    throw new Error(`Gemini API Error (${response.status}): ${parsedMsg}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Empty response received from Gemini API.');
  }

  return rawText;
}
