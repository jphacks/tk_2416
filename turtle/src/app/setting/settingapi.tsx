// /settingapi.tsx

const API_BASE_URL = 'http://localhost:8000';

export const setUserName = async (name: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/setUserName`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName: name }), // ボディにユーザー名を含める
    });

    // レスポンスが成功でない場合はエラーをスロー
    if (!response.ok) {
      const errorData = await response.json(); // エラー詳細を取得
      throw new Error(`Error ${response.status}: ${errorData.message || 'Failed to set user name'}`);
    }

    return await response.json(); // 成功時のレスポンスを返す
  } catch (error) {
    console.error('Error in setUserName:', error);
    throw error; // エラーを再スローして呼び出し元で処理できるようにする
  }
};


export const calculateBaseStamina = async (userid: string, strength: number) => {
  const response = await fetch(`${API_BASE_URL}/calculateBaseStaminaByUserInput`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: userid, stamina: strength }),
  });
  return response.json();
};

export const storeMentionsInfo = async (userid: string, description: string) => {
  const response = await fetch(`${API_BASE_URL}/storeMentionsInfo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: userid, mentions: description }),

  });
  return response.json();
};
  