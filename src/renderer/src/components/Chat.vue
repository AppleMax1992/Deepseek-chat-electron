<template>
    <v-container
      style="height: 100vh"
      class="d-flex flex-column justify-space-between"
    >
      <v-row>
        <v-col cols="12">
          <!-- Messages Display in Individual Cards -->
          <div  ref="messagesContainer" id="messages-container">
            <div class="d-flex"  v-for="(msg, index) in messages" :key="index">
              <span class="mr-4 text-h6">{{
                msg.role === "system" ? "🤖" : "😎"
              }}</span>
              <v-card
                :key="index"
                class="mb-4"
                v-loading = "req_loading && msg.role === 'system' && index + 1 === messages.length"
                :variant="req_loading ? 'flat':'outlined'"
              >
                <v-card-text>{{ msg.content }}</v-card-text>
              </v-card>
            </div>
          </div>
        </v-col>
      </v-row>
  
      <v-row
        v-if="messages.length === 0"
        class="justify-space-between flex-grow-0"
        
      >
        <v-spacer></v-spacer>
        <v-card
          class="ma-4"
          variant="tonal"
          color="primary"
          @click="handleSubmitTemplatePrompt('什么是岩层')"
        >
          <v-card-text >什么是岩层</v-card-text>
        </v-card>
        <v-card
          class="ma-4"
          variant="tonal"
          color="primary"
          @click="handleSubmitTemplatePrompt('中国矿业大学')"
        >
          <v-card-text>cumt</v-card-text>
        </v-card>
        <v-card
          class="ma-4"
          variant="tonal"
          color="primary"
          @click="handleSubmitTemplatePrompt('你好')"
        >
          <v-card-text>你好</v-card-text>
        </v-card>
        <v-spacer></v-spacer>
      </v-row>
  
      <v-row class="flex-grow-0">
        <v-col cols="12">
          <v-textarea
            v-model="cmessage"
            label="请输入"
            variant="outlined"
            @click:append="sendMessage"
            @keydown.enter.prevent="sendMessage"
            single-line
            rows="2"
            no-resize
          >
            <template v-slot:append>
              <v-btn
                @click="sendMessage"
                :disabled="asyncState.isLoading"
                icon="mdi-send"
                variant="plain"
              ></v-btn>
            </template>
          </v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, watch, nextTick, reactive } from "vue";
  
  const messagesContainer = ref(null);
  const cmessage = ref("");
  const messages = ref([]);
  const asyncState = reactive({ isLoading: false, error: null });
  const req_loading = ref(false)


  const openAIKey = import.meta.env.VITE_APP_OPENAI_KEY;
  
  async function fetchOpenAIResponse(userMessage) {
    const copyOfUserMessage = userMessage;
    asyncState.isLoading = true;
    const currentMessageIndex = messages.value.length;
    cmessage.value = copyOfUserMessage
    messages.value.push({ role: "system", content: "" });
    req_loading.value = true
    try {
      const response = await fetch("http://i-2.gpushare.com:30739/chat", {
        // mode: 'cors',
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: cmessage.value
        }),
        data:null
      });
      req_loading.value = false
      const reader = response.body.getReader();
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
            messages.value[currentMessageIndex].content += chunk;
          } catch (error) {
            console.error("Error parsing JSON line:", error, line);
          }
      }
    } catch (error) {
      cmessage.value = copyOfUserMessage; // Restore the user message
      console.error("Error fetching OpenAI response:", error);
      return "Sorry, I couldn't process that.";
    } finally {
      asyncState.isLoading = false;
    }
  }
  
  async function sendMessage() {
    if (asyncState.isLoading) return;
    if (cmessage.value.trim()) {
      // Append user message to the chat history
      messages.value.push({ role: "user", content: cmessage.value });
      const userInput = cmessage.value; // Save the user input before clearing the message
      cmessage.value = "";
  
      // Fetch LLM response and append it to the chat history
      await fetchOpenAIResponse(userInput);
      // messages.value.push({ role: "system", content: LlmResponse });
    }
  }
  
  const handleSubmitTemplatePrompt = (template) => {
    cmessage.value = template;
    sendMessage();
  };
  
  watch(
    messages,
    () => {
      //scroll to the bottom of the messages container
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop =
            messagesContainer.value.scrollHeight;
        }
      });
    },
    { deep: true },
  );
  </script>
  
  <style>
  #messages-container {
    max-height: 80vh;
    overflow-y: auto;
  }
  .el-loading-spinner {
  transform: scale(0.5); /* 调整整体缩放 */
}
  </style>