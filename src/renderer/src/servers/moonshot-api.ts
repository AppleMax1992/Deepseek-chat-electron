// const client = new OpenAI({
//   apiKey: $MOONSHOT_API_KEY, // This is the default and can be omitted
//   dangerouslyAllowBrowser: true,
//   baseURL: 'https://api.moonshot.cn/v1'
// })

export const customChat = async (cmessage: any) => {
    const response = await fetch("http://i-2.gpushare.com:30739/chat", {
      method: "POST",
      mode:"cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: cmessage.content
      })
    });
    const reader = response.body!.getReader();
    while (true) {
      
      const { done, value } = await reader.read();
      if (done) break;
      const decoded = new TextDecoder("utf-8").decode(value);
      const lines = decoded
        .replaceAll(/^data: /gm, "")
        .split("\n")
        .filter((c) => c);

      try {
          const chunk = decoded;
          //   messages.value[currentMessageIndex].content += chunk;
          console.debug("response", chunk);
          return chunk;
        } catch (error) {
          console.error("Error parsing JSON line:", error, lines);
        }
    }

  };