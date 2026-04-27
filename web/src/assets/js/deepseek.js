class DeepSeekAPI {
    constructor(baseUrl = 'https://api.deepseek.com/chat/completions', apiKey = 'sk-5386ba86655a4472b20ded330af59156') {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }

    readChunk(chunk, callback_success) {
        let content = ""
        chunk.split("data: ").forEach((text) => {
            if (text.trim() === "") return;
            if (text.trim() === "[DONE]") return;
            try {
                let jsonObject = JSON.parse(text.trim());
                let choices = jsonObject['choices'];
                if (jsonObject['object'] !== 'chat.completion.chunk' || choices === undefined || choices.length <= 0) return;
                let delta_content = choices[0]['delta']['content'];
                if (delta_content && typeof callback_success === 'function') callback_success(delta_content);  // 输出内容
                content += delta_content;// 输出或处理解析后的数据
            } catch (error) {
                console.error("解析错误:", error);
            }
        })
        return content;
    }

    async readeResponseStream(reader, callback_success) {
        const decoder = new TextDecoder();
        let contents = "";
        while (true) {
            const {done, value} = await reader.read();
            if (done) {
                console.log("reade response stream finished");
                break;
            }
            let chunk = decoder.decode(value, {stream: true});// 将读取的二进制数据解码为字符串
            contents += this.readChunk(chunk, callback_success);
        }
        return contents;
    }

// 发送请求
    async chatStream(messages, callback_success, stream = true) {
        try {
            const response = await fetch(this.baseUrl, {
                method: "POST", headers: {
                    "Content-Type": "application/json", "Authorization": `Bearer ${this.apiKey}`
                }, body: JSON.stringify({
                    model: "deepseek-chat", messages: messages, stream: stream
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);      // 检查响应是否正常
            }
            // 如果是流式输出
            if (stream) {
                return await this.readeResponseStream(response.body.getReader(), content => {
                    if (callback_success !== undefined) callback_success(content)
                });
            } else {
                return await response.text()
            }
        } catch (error) {
            console.error("请求失败:", error);
        }
    }

    async chat(messages, callback_success, stream = false) {
        return await this.chatStream(messages,null,false)
    }

    async testChat(msg="hi!", callback_success=data => process.stdout.write(data)) {
        let message = await this.chatStream([{role: "system", content: "You are a helpful assistant."}, {
            role: "user",
            content: msg
        }],callback_success);
        console.log("message:" + message);
        return message;
    }
}

window.OpenAI = DeepSeekAPI
// 导出类，使其可以在其他文件中使用
// export default DeepSeekAPI;
// // 使用示例
// const deepseek = new DeepSeekAPI();
// let message = await deepseek.chat("hi!");

