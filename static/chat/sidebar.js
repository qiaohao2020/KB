document.addEventListener('DOMContentLoaded', () => {
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendMessage');
  const chatMessages = document.getElementById('chatMessages');
  
  // 功能按钮元素
  const summarizeBtn = document.getElementById('summarizeBtn');
  const generateApiBtn = document.getElementById('generateApiBtn');
  const translateBtn = document.getElementById('translateBtn');
  const explainCodeBtn = document.getElementById('explainCodeBtn');
  const optimizeCodeBtn = document.getElementById('optimizeCodeBtn');

  // 获取当前标签页的内容
  async function getCurrentTabContent() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, { action: 'getPageContent' }, (response) => {
        resolve(response);
      });
    });
  }

  // 生成内容摘要
  function generateSummary(content) {
    const summary = [];
    
    // 添加标题
    if (content.title) {
      summary.push(`页面标题：${content.title}`);
    }
    
    // 添加主要标题
    if (content.headings && content.headings.length > 0) {
      summary.push('主要章节：');
      content.headings.slice(0, 5).forEach(heading => {
        summary.push(`- ${heading}`);
      });
    }
    
    // 添加段落摘要
    if (content.paragraphs && content.paragraphs.length > 0) {
      summary.push('内容要点：');
      content.paragraphs.slice(0, 3).forEach(paragraph => {
        // 截取段落前100个字符
        const preview = paragraph.length > 100 
          ? paragraph.substring(0, 100) + '...' 
          : paragraph;
        summary.push(`- ${preview}`);
      });
    }
    
    return summary.join('\n');
  }

  // 显示页面摘要
  async function showPageSummary() {
    try {
      const content = await getCurrentTabContent();
      const summary = generateSummary(content);
      
      const summaryElement = document.createElement('div');
      summaryElement.className = 'message received summary';
      summaryElement.innerHTML = summary.replace(/\n/g, '<br>');
      chatMessages.appendChild(summaryElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
      // console.error('获取页面内容失败:', error);
    }
  }

  // 页面加载完成后自动显示摘要
  showPageSummary();

  // 发送消息函数
  function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
      // 创建消息元素
      const messageElement = document.createElement('div');
      messageElement.className = 'message sent';
      messageElement.textContent = message;
      
      // 添加消息到聊天窗口
      chatMessages.appendChild(messageElement);
      
      // 清空输入框
      messageInput.value = '';
      
      // 滚动到底部
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // 模拟接收消息（示例）
      setTimeout(() => {
        const responseElement = document.createElement('div');
        responseElement.className = 'message received';
        responseElement.textContent = '这是一条自动回复消息';
        chatMessages.appendChild(responseElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1000);
    }
  }

  // 点击发送按钮发送消息
  sendButton.addEventListener('click', sendMessage);

  // 按回车键发送消息
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // 功能按钮事件处理
  
  // 摘要当前内容
  summarizeBtn.addEventListener('click', async () => {
    try {
      const content = await getCurrentTabContent();
      const summary = generateSummary(content);
      
      // 添加用户操作消息
      const userActionElement = document.createElement('div');
      userActionElement.className = 'message sent';
      userActionElement.textContent = '摘要当前页面内容';
      chatMessages.appendChild(userActionElement);
      
      // 添加摘要结果
      const summaryElement = document.createElement('div');
      summaryElement.className = 'message received summary';
      summaryElement.innerHTML = summary.replace(/\n/g, '<br>');
      chatMessages.appendChild(summaryElement);
      
      // 滚动到底部
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
      console.error('获取页面内容失败:', error);
    }
  });
  
  // 生成接口代码 - 多轮对话
  generateApiBtn.addEventListener('click', async () => {
    try {
      const content = await getCurrentTabContent();
      
      // 添加用户操作消息
      const userActionElement = document.createElement('div');
      userActionElement.className = 'message sent';
      userActionElement.textContent = '根据当前页面生成接口代码';
      chatMessages.appendChild(userActionElement);
      
      // 第一步：生成OpenAI标准接口描述文件
      setTimeout(() => {
        const openApiSpec = `// OpenAI API 标准接口描述文件 (OpenAPI 3.0)
openapi: 3.0.0
info:
  title: 基于页面内容生成的API
  description: 根据当前页面内容自动生成的API接口描述
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
    description: 生产环境服务器
paths:
  /data:
    get:
      summary: 获取数据列表
      description: 根据查询参数获取数据列表
      operationId: getDataList
      parameters:
        - name: page
          in: query
          description: 页码
          required: false
          schema:
            type: integer
            default: 1
        - name: size
          in: query
          description: 每页数量
          required: false
          schema:
            type: integer
            default: 10
      responses:
        '200':
          description: 成功获取数据
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DataListResponse'
    post:
      summary: 创建新数据
      description: 创建一条新的数据记录
      operationId: createData
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DataRequest'
      responses:
        '201':
          description: 数据创建成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DataResponse'
  /data/{id}:
    get:
      summary: 获取单条数据
      description: 根据ID获取单条数据详情
      operationId: getDataById
      parameters:
        - name: id
          in: path
          description: 数据ID
          required: true
          schema:
            type: string
      responses:
        '200':
          description: 成功获取数据
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DataResponse'
components:
  schemas:
    DataRequest:
      type: object
      properties:
        title:
          type: string
          description: 数据标题
        description:
          type: string
          description: 数据描述
      required:
        - title
    DataResponse:
      type: object
      properties:
        id:
          type: string
          description: 数据ID
        title:
          type: string
          description: 数据标题
        description:
          type: string
          description: 数据描述
        createdAt:
          type: string
          format: date-time
          description: 创建时间
        updatedAt:
          type: string
          format: date-time
          description: 更新时间
      required:
        - id
        - title
        - createdAt
    DataListResponse:
      type: object
      properties:
        total:
          type: integer
          description: 总记录数
        page:
          type: integer
          description: 当前页码
        size:
          type: integer
          description: 每页数量
        data:
          type: array
          items:
            $ref: '#/components/schemas/DataResponse'
      required:
        - total
        - data`;
        
        const openApiElement = document.createElement('div');
        openApiElement.className = 'message received';
        openApiElement.innerHTML = `<pre><code class="language-yaml">${openApiSpec}</code></pre>`;
        chatMessages.appendChild(openApiElement);
        
        // 应用代码高亮
        if (window.hljs) {
          document.querySelectorAll('pre code').forEach((block) => {
            window.hljs.highlightBlock(block);
          });
        }
        
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // 第二步：生成Java代码
        setTimeout(() => {
          const javaCode = `// 根据OpenAPI规范生成的Java代码
package com.example.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@SpringBootApplication
public class ApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }
}

// 数据模型
class Data {
    private String id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 构造函数
    public Data() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

// 请求模型
class DataRequest {
    private String title;
    private String description;
    
    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

// 响应模型
class DataResponse {
    private String id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 从Data创建响应
    public static DataResponse fromData(Data data) {
        DataResponse response = new DataResponse();
        response.setId(data.getId());
        response.setTitle(data.getTitle());
        response.setDescription(data.getDescription());
        response.setCreatedAt(data.getCreatedAt());
        response.setUpdatedAt(data.getUpdatedAt());
        return response;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

// 列表响应模型
class DataListResponse {
    private int total;
    private int page;
    private int size;
    private List<DataResponse> data;
    
    // Getters and Setters
    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }
    
    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }
    
    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }
    
    public List<DataResponse> getData() { return data; }
    public void setData(List<DataResponse> data) { this.data = data; }
}

// 控制器
@RestController
@RequestMapping("/api/v1")
public class DataController {
    
    // 模拟数据存储
    private final Map<String, Data> dataStore = new HashMap<>();
    
    // 获取数据列表
    @GetMapping("/data")
    public ResponseEntity<DataListResponse> getDataList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        List<DataResponse> dataList = new ArrayList<>();
        for (Data data : dataStore.values()) {
            dataList.add(DataResponse.fromData(data));
        }
        
        DataListResponse response = new DataListResponse();
        response.setTotal(dataList.size());
        response.setPage(page);
        response.setSize(size);
        response.setData(dataList);
        
        return ResponseEntity.ok(response);
    }
    
    // 获取单条数据
    @GetMapping("/data/{id}")
    public ResponseEntity<DataResponse> getDataById(@PathVariable String id) {
        Data data = dataStore.get(id);
        if (data == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(DataResponse.fromData(data));
    }
    
    // 创建数据
    @PostMapping("/data")
    public ResponseEntity<DataResponse> createData(@RequestBody DataRequest request) {
        Data data = new Data();
        data.setId(generateId());
        data.setTitle(request.getTitle());
        data.setDescription(request.getDescription());
        
        dataStore.put(data.getId(), data);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(DataResponse.fromData(data));
    }
    
    // 生成ID
    private String generateId() {
        return java.util.UUID.randomUUID().toString();
    }
}`;
          
          const javaElement = document.createElement('div');
          javaElement.className = 'message received';
          javaElement.innerHTML = `<pre><code class="language-java">${javaCode}</code></pre>`;
          chatMessages.appendChild(javaElement);
          
          // 应用代码高亮
          if (window.hljs) {
            document.querySelectorAll('pre code').forEach((block) => {
              window.hljs.highlightBlock(block);
            });
          }
          
          // 滚动到底部
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 2000);
      }, 1000);
    } catch (error) {
      console.error('获取页面内容失败:', error);
    }
  });
  
  // 翻译成中文
  translateBtn.addEventListener('click', async () => {
    try {
      const content = await getCurrentTabContent();
      
      // 添加用户操作消息
      const userActionElement = document.createElement('div');
      userActionElement.className = 'message sent';
      userActionElement.textContent = '将当前页面内容翻译成中文';
      chatMessages.appendChild(userActionElement);
      
      // 模拟翻译结果
      setTimeout(() => {
        const translatedContent = `页面标题：${content.title || '未知标题'}

主要内容翻译：
${content.paragraphs && content.paragraphs.length > 0 
  ? content.paragraphs.slice(0, 2).map(p => p.substring(0, 100) + '...').join('\n\n') 
  : '无法获取页面内容'}`;
        
        const translatedElement = document.createElement('div');
        translatedElement.className = 'message received';
        translatedElement.innerHTML = translatedContent.replace(/\n/g, '<br>');
        chatMessages.appendChild(translatedElement);
        
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1000);
    } catch (error) {
      console.error('获取页面内容失败:', error);
    }
  });
  
  // 解释代码
  explainCodeBtn.addEventListener('click', async () => {
    try {
      const content = await getCurrentTabContent();
      
      // 添加用户操作消息
      const userActionElement = document.createElement('div');
      userActionElement.className = 'message sent';
      userActionElement.textContent = '解释当前页面中的代码';
      chatMessages.appendChild(userActionElement);
      
      // 模拟代码解释
      setTimeout(() => {
        const explanation = `代码解释：

1. 页面结构分析：
   - 使用了HTML5标准文档结构
   - 包含多个JavaScript函数和事件监听器
   - 使用了CSS进行样式设计

2. 主要功能：
   - 页面内容获取和展示
   - 用户交互处理
   - 数据请求和响应处理

3. 技术实现：
   - 使用Fetch API进行网络请求
   - 使用Promise处理异步操作
   - 使用DOM操作更新页面内容`;
        
        const explanationElement = document.createElement('div');
        explanationElement.className = 'message received';
        explanationElement.innerHTML = explanation.replace(/\n/g, '<br>');
        chatMessages.appendChild(explanationElement);
        
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1000);
    } catch (error) {
      console.error('获取页面内容失败:', error);
    }
  });
  
  // 优化代码
  optimizeCodeBtn.addEventListener('click', async () => {
    try {
      const content = await getCurrentTabContent();
      
      // 添加用户操作消息
      const userActionElement = document.createElement('div');
      userActionElement.className = 'message sent';
      userActionElement.textContent = '优化当前页面中的代码';
      chatMessages.appendChild(userActionElement);
      
      // 模拟代码优化
      setTimeout(() => {
        const optimizedCode = `// 优化后的代码示例
// 使用async/await简化异步操作
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取数据失败:', error);
    throw error;
  }
}

// 使用箭头函数和模板字符串
const formatMessage = (user, message) => \`\${user}: \${message}\`;

// 使用解构赋值简化代码
const { id, name, email } = userData;

// 使用可选链和空值合并操作符
const userName = user?.profile?.name ?? '匿名用户';`;
        
        const optimizedElement = document.createElement('div');
        optimizedElement.className = 'message received';
        optimizedElement.innerHTML = `<pre><code class="language-javascript">${optimizedCode}</code></pre>`;
        chatMessages.appendChild(optimizedElement);
        
        // 应用代码高亮
        if (window.hljs) {
          document.querySelectorAll('pre code').forEach((block) => {
            window.hljs.highlightBlock(block);
          });
        }
        
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1000);
    } catch (error) {
      console.error('获取页面内容失败:', error);
    }
  });
}); 