const app = new Vue({
    el: '#app',
    data: {
        chats: [],
        currentChat: null,
        messageInput: '',
        activeNavItem: 'chat',
        isLoading: false
    },
    methods: {
        // 创建新对话
        createNewChat() {
            const newChat = {
                id: Date.now(),
                title: '新对话',
                messages: []
            };
            this.chats.unshift(newChat);
            this.currentChat = newChat;
        },

        // 删除对话
        deleteChat(chatId) {
            const index = this.chats.findIndex(chat => chat.id === chatId);
            if (index !== -1) {
                this.chats.splice(index, 1);
                if (this.currentChat && this.currentChat.id === chatId) {
                    this.currentChat = this.chats.length > 0 ? this.chats[0] : null;
                }
            }
        },

        // 切换对话
        switchChat(chat) {
            this.currentChat = chat;
        },

        // 切换导航项
        switchNavItem(item) {
            this.activeNavItem = item;
        },

        // 发送消息
        async sendMessage() {
            if (!this.messageInput.trim() || !this.currentChat) return;

            const userMessage = {
                role: 'user',
                content: this.messageInput.trim()
            };

            this.currentChat.messages.push(userMessage);
            this.messageInput = '';

            this.isLoading = true;

            try {
                // 这里添加与后端API的通信逻辑
                const response = await this.callAPI(userMessage.content);
                
                const assistantMessage = {
                    role: 'assistant',
                    content: response
                };

                this.currentChat.messages.push(assistantMessage);
                
                // 更新对话标题（如果是第一条消息）
                if (this.currentChat.messages.length === 2) {
                    this.currentChat.title = userMessage.content.slice(0, 30) + '...';
                }
            } catch (error) {
                console.error('发送消息失败:', error);
                // 添加错误提示消息
                this.currentChat.messages.push({
                    role: 'assistant',
                    content: '抱歉，发送消息时出现错误，请稍后重试。'
                });
            } finally {
                this.isLoading = false;
            }
        },

        // 调用API
        async callAPI(message) {
            // 这里实现与后端API的通信
            // 示例实现：
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve('这是一个示例回复。实际使用时，这里应该调用真实的后端API。');
                }, 1000);
            });
        },

        // 复制消息内容
        copyMessage(content) {
            navigator.clipboard.writeText(content).then(() => {
                // 可以添加复制成功的提示
                console.log('复制成功');
            }).catch(err => {
                console.error('复制失败:', err);
            });
        },

        // 重新生成回复
        async regenerateResponse(messageIndex) {
            if (!this.currentChat) return;

            // 删除当前回复
            this.currentChat.messages.splice(messageIndex + 1);

            this.isLoading = true;

            try {
                const response = await this.callAPI(this.currentChat.messages[messageIndex].content);
                
                const assistantMessage = {
                    role: 'assistant',
                    content: response
                };

                this.currentChat.messages.push(assistantMessage);
            } catch (error) {
                console.error('重新生成回复失败:', error);
                this.currentChat.messages.push({
                    role: 'assistant',
                    content: '抱歉，重新生成回复时出现错误，请稍后重试。'
                });
            } finally {
                this.isLoading = false;
            }
        }
    },
    mounted() {
        // 创建初始对话
        this.createNewChat();
    }
}); 