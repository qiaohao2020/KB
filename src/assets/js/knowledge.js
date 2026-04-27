// 获取 DOM 元素
const categoryTree = document.getElementById('categoryTree');
const knowledgeList = document.getElementById('knowledgeList');
const knowledgeForm = document.getElementById('knowledgeForm');
const editSidebar = document.querySelector('.edit-sidebar');

// 获取搜索相关元素
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

// 获取导入相关元素
const importModal = document.getElementById('importModal');
const importButton = document.getElementById('importKnowledge');
const closeModal = document.querySelector('.close-modal');
const cancelImport = document.getElementById('cancelImport');
const confirmImport = document.getElementById('confirmImport');
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const fileInfo = document.getElementById('fileInfo');
const fileName = fileInfo.querySelector('.file-name');
const removeFile = fileInfo.querySelector('.remove-file');
const importTypeFile = document.getElementById('importTypeFile');
const importTypeText = document.getElementById('importTypeText');
const fileUploadSection = document.getElementById('fileUploadSection');
const textImportSection = document.getElementById('textImportSection');
const importText = document.getElementById('importText');

// 全局变量
let categories = [];
let knowledgeItems = [];

// 当前选中的分类
let currentCategory = null;

// 加载数据
async function loadData() {
    try {
        const response = await fetch('../data/knowledge.json');
        const data = await response.json();
        
        categories = data.categories;
        knowledgeItems = data.knowledgeItems;
        
        // 初始化分类树和知识列表
        initCategoryTree();
        updateKnowledgeList();
    } catch (error) {
        console.error('加载数据失败:', error);
        showMessage('加载数据失败：' + error.message, 'error');
    }
}

// 初始化分类树
function initCategoryTree() {
    categoryTree.innerHTML = categories.map(category => `
        <div class="category-item" data-id="${category.id}">
            <div class="category-header">
                <i class="bi bi-folder"></i>
                <span>${category.name}</span>
            </div>
            <div class="category-children">
                ${category.children.map(child => `
                    <div class="category-child" data-id="${child.id}">
                        <i class="bi bi-file-text"></i>
                        <span>${child.name}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    // 添加分类点击事件
    document.querySelectorAll('.category-item, .category-child').forEach(item => {
        item.addEventListener('click', () => {
            // 移除其他分类的选中状态
            document.querySelectorAll('.category-item, .category-child').forEach(el => {
                el.classList.remove('active');
            });
            
            // 添加当前分类的选中状态
            item.classList.add('active');
            
            // 更新当前选中的分类
            currentCategory = item.querySelector('span').textContent;
            
            // 更新知识列表
            updateKnowledgeList();
        });
    });
}

// 更新知识列表
function updateKnowledgeList() {
    let filteredData = knowledgeItems;
    
    // 如果有选中的分类，进行筛选
    if (currentCategory) {
        filteredData = knowledgeItems.filter(item => item.category === currentCategory);
    }
    
    // 更新知识列表
    knowledgeList.innerHTML = filteredData.map(item => `
        <div class="knowledge-item" data-id="${item.id}">
            <div class="item-header">
                <h3>${item.title}</h3>
                <div class="item-meta">
                    <span class="category">${item.category}</span>
                    <span class="status ${item.status}">${item.status === 'active' ? '已发布' : '草稿'}</span>
                    <span class="time">${item.createTime}</span>
                    <div class="item-actions">
                        <button class="btn-icon edit-btn" title="编辑">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn-icon delete-btn" title="删除">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="item-content">
                <p>${item.content}</p>
                <div class="item-tags">
                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
    
    // 更新知识总数
    updateTotalCount();
}

// 显示编辑侧边栏
function showEditSidebar() {
    editSidebar.style.display = 'flex';
    setTimeout(() => {
        editSidebar.classList.add('active');
    }, 10);
}

// 隐藏编辑侧边栏
function hideEditSidebar() {
    editSidebar.classList.remove('active');
    setTimeout(() => {
        editSidebar.style.display = 'none';
    }, 300);
}

// 处理添加知识
function handleAddKnowledge() {
    knowledgeForm.reset();
    showEditSidebar();
}

// 处理保存知识
function handleSaveKnowledge(e) {
    e.preventDefault();
    // 这里添加保存逻辑
    hideEditSidebar();
}

// 处理取消编辑
function handleCancelEdit() {
    hideEditSidebar();
}

// 处理删除知识
function handleDeleteKnowledge(id) {
    if (confirm('确定要删除这条知识吗？')) {
        // 这里添加删除逻辑
        console.log('删除知识:', id);
    }
}

// 处理编辑知识
function handleEditKnowledge(id) {
    const item = knowledgeItems.find(item => item.id === id);
    if (item) {
        document.getElementById('knowledgeTitle').value = item.title;
        document.getElementById('knowledgeCategory').value = item.category;
        document.getElementById('knowledgeContent').value = item.content;
        document.getElementById('knowledgeTags').value = item.tags.join(',');
        document.getElementById('knowledgeStatus').value = item.status;
        showEditSidebar();
    }
}

// 事件监听
document.getElementById('addKnowledge').addEventListener('click', handleAddKnowledge);
document.getElementById('saveKnowledge').addEventListener('click', handleSaveKnowledge);
document.getElementById('cancelEdit').addEventListener('click', handleCancelEdit);

// 知识列表事件委托
knowledgeList.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('.edit-btn')) {
        const id = parseInt(target.closest('.edit-btn').dataset.id);
        handleEditKnowledge(id);
    } else if (target.closest('.delete-btn')) {
        const id = parseInt(target.closest('.delete-btn').dataset.id);
        handleDeleteKnowledge(id);
    }
});

// 为编辑按钮添加点击事件
document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        showEditSidebar();
    });
});

// 点击遮罩层关闭侧边栏
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-sidebar-overlay')) {
        hideEditSidebar();
    }
});

// 搜索功能
function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const knowledgeItems = document.querySelectorAll('.knowledge-item');
    
    knowledgeItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const content = item.querySelector('.item-content p').textContent.toLowerCase();
        const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const isMatch = title.includes(searchTerm) || 
                       content.includes(searchTerm) || 
                       tags.some(tag => tag.includes(searchTerm));
        
        item.style.display = isMatch ? 'block' : 'none';
    });
    
    // 更新知识总数显示
    updateTotalCount();
}

// 更新知识总数显示
function updateTotalCount() {
    const visibleItems = document.querySelectorAll('.knowledge-item[style="display: block"]').length;
    const totalCount = document.getElementById('totalCount');
    totalCount.textContent = visibleItems;
}

// 添加搜索事件监听
searchButton.addEventListener('click', performSearch);

// 添加回车键搜索
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// 添加输入防抖
let searchTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(performSearch, 300);
});

// 导入类型切换
importTypeFile.addEventListener('change', () => {
    fileUploadSection.style.display = 'block';
    textImportSection.style.display = 'none';
});

importTypeText.addEventListener('change', () => {
    fileUploadSection.style.display = 'none';
    textImportSection.style.display = 'block';
});

// 打开导入对话框
importButton.addEventListener('click', () => {
    importModal.classList.add('active');
});

// 关闭导入对话框
function closeImportModal() {
    importModal.classList.remove('active');
    resetImportForm();
}

closeModal.addEventListener('click', closeImportModal);
cancelImport.addEventListener('click', closeImportModal);

// 重置导入表单
function resetImportForm() {
    fileInput.value = '';
    fileInfo.style.display = 'none';
    importText.value = '';
    importTypeFile.checked = true;
    fileUploadSection.style.display = 'block';
    textImportSection.style.display = 'none';
}

// 文件上传区域点击事件
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// 文件拖放事件
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#1976d2';
    uploadArea.style.backgroundColor = 'rgba(25, 118, 210, 0.05)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ddd';
    uploadArea.style.backgroundColor = 'transparent';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ddd';
    uploadArea.style.backgroundColor = 'transparent';
    
    const file = e.dataTransfer.files[0];
    if (file) {
        handleFileSelect(file);
    }
});

// 文件选择事件
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFileSelect(file);
    }
});

// 处理文件选择
function handleFileSelect(file) {
    const validTypes = ['.json', '.txt', '.md'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(fileExt)) {
        alert('请选择有效的文件格式（.json, .txt, .md）');
        return;
    }
    
    fileName.textContent = file.name;
    fileInfo.style.display = 'flex';
}

// 移除文件
removeFile.addEventListener('click', () => {
    fileInput.value = '';
    fileInfo.style.display = 'none';
});

// 确认导入
confirmImport.addEventListener('click', async () => {
    try {
        if (importTypeFile.checked) {
            const file = fileInput.files[0];
            if (!file) {
                alert('请选择要导入的文件');
                return;
            }
            
            const content = await readFile(file);
            const knowledgeItems = parseImportContent(content, file.name);
            importKnowledgeItems(knowledgeItems);
        } else {
            const content = importText.value.trim();
            if (!content) {
                alert('请输入要导入的内容');
                return;
            }
            
            const knowledgeItems = parseImportContent(content);
            importKnowledgeItems(knowledgeItems);
        }
        
        closeImportModal();
        updateKnowledgeList();
    } catch (error) {
        alert('导入失败：' + error.message);
    }
});

// 读取文件内容
function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('文件读取失败'));
        reader.readAsText(file);
    });
}

// 解析导入内容
function parseImportContent(content, fileName = '') {
    try {
        // 如果是 JSON 文件
        if (fileName.endsWith('.json')) {
            return JSON.parse(content);
        }
        
        // 如果是 Markdown 或文本文件
        const items = [];
        const lines = content.split('\n');
        let currentItem = null;
        
        for (const line of lines) {
            if (line.startsWith('# ')) {
                if (currentItem) {
                    items.push(currentItem);
                }
                currentItem = {
                    title: line.substring(2),
                    content: '',
                    category: '未分类',
                    tags: [],
                    status: 'active',
                    createTime: new Date().toISOString().split('T')[0]
                };
            } else if (currentItem) {
                currentItem.content += line + '\n';
            }
        }
        
        if (currentItem) {
            items.push(currentItem);
        }
        
        return items;
    } catch (error) {
        throw new Error('文件格式错误：' + error.message);
    }
}

// 导入知识项
function importKnowledgeItems(items) {
    if (!Array.isArray(items)) {
        throw new Error('导入的数据格式不正确');
    }
    
    items.forEach(item => {
        if (!item.title || !item.content) {
            throw new Error('知识项缺少必要字段');
        }
        
        // 添加到知识库
        knowledgeData.push({
            id: Date.now(),
            title: item.title,
            content: item.content,
            category: item.category || '未分类',
            tags: item.tags || [],
            status: item.status || 'active',
            createTime: item.createTime || new Date().toISOString().split('T')[0]
        });
    });
    
    alert(`成功导入 ${items.length} 条知识`);
}

// 导入类型切换处理
document.querySelectorAll('input[name="importType"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const fileSection = document.getElementById('fileUploadSection');
        const dbSection = document.getElementById('dbImportSection');
        const textSection = document.getElementById('textImportSection');

        fileSection.style.display = this.value === 'file' ? 'block' : 'none';
        dbSection.style.display = this.value === 'db' ? 'block' : 'none';
        textSection.style.display = this.value === 'text' ? 'block' : 'none';
    });
});

// 数据库导入处理
document.getElementById('confirmImport').addEventListener('click', async function() {
    const importType = document.querySelector('input[name="importType"]:checked').value;
    
    if (importType === 'db') {
        const dbConfig = {
            type: document.getElementById('dbType').value,
            host: document.getElementById('dbHost').value,
            port: document.getElementById('dbPort').value,
            database: document.getElementById('dbName').value,
            username: document.getElementById('dbUser').value,
            password: document.getElementById('dbPassword').value,
            query: document.getElementById('dbQuery').value
        };

        // 验证必填字段
        if (!dbConfig.host || !dbConfig.port || !dbConfig.database || 
            !dbConfig.username || !dbConfig.password || !dbConfig.query) {
            showMessage('请填写所有必填字段', 'error');
            return;
        }

        try {
            // 显示加载状态
            this.disabled = true;
            this.innerHTML = '<i class="bi bi-arrow-repeat"></i> 导入中...';

            // 调用后端API进行数据库导入
            const response = await fetch('/api/knowledge/import/db', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dbConfig)
            });

            const result = await response.json();

            if (result.success) {
                showMessage('数据库导入成功', 'success');
                closeModal('importModal');
                // 刷新知识列表
                loadKnowledgeList();
            } else {
                showMessage(result.message || '数据库导入失败', 'error');
            }
        } catch (error) {
            console.error('数据库导入错误:', error);
            showMessage('数据库导入失败：' + error.message, 'error');
        } finally {
            // 恢复按钮状态
            this.disabled = false;
            this.innerHTML = '导入';
        }
    }
});

// 显示消息提示
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// 处理新增知识分类
document.getElementById('addCategory').addEventListener('click', function() {
    // 显示新增分类对话框
    const modal = document.getElementById('addCategoryModal');
    modal.style.display = 'block';
    
    // 加载父级分类选项
    loadParentCategories();
});

// 加载父级分类选项
function loadParentCategories() {
    const parentSelect = document.getElementById('parentCategory');
    // 清空现有选项，保留"无"选项
    parentSelect.innerHTML = '<option value="">无（顶级分类）</option>';
    
    // 从分类树中获取所有分类
    const categories = document.querySelectorAll('.category-item');
    categories.forEach(category => {
        const categoryName = category.querySelector('span').textContent;
        const categoryId = category.dataset.id;
        
        const option = document.createElement('option');
        option.value = categoryId;
        option.textContent = categoryName;
        parentSelect.appendChild(option);
    });
}

// 关闭新增分类对话框
function closeAddCategoryModal() {
    const modal = document.getElementById('addCategoryModal');
    modal.style.display = 'none';
    document.getElementById('categoryForm').reset();
}

// 确认添加分类
document.getElementById('confirmAddCategory').addEventListener('click', async function() {
    const categoryName = document.getElementById('categoryName').value.trim();
    const parentId = document.getElementById('parentCategory').value;
    const description = document.getElementById('categoryDescription').value.trim();
    
    if (!categoryName) {
        showMessage('请输入分类名称', 'error');
        return;
    }
    
    try {
        // 显示加载状态
        this.disabled = true;
        this.innerHTML = '<i class="bi bi-arrow-repeat"></i> 保存中...';
        
        // 调用后端API添加分类
        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: categoryName,
                parentId: parentId || null,
                description: description
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('分类添加成功', 'success');
            closeAddCategoryModal();
            // 刷新分类树
            loadCategoryTree();
        } else {
            showMessage(result.message || '分类添加失败', 'error');
        }
    } catch (error) {
        console.error('添加分类错误:', error);
        showMessage('分类添加失败：' + error.message, 'error');
    } finally {
        // 恢复按钮状态
        this.disabled = false;
        this.innerHTML = '确定';
    }
});

// 取消添加分类
document.getElementById('cancelAddCategory').addEventListener('click', closeAddCategoryModal);

// 点击关闭按钮关闭对话框
document.querySelector('#addCategoryModal .close-modal').addEventListener('click', closeAddCategoryModal);

// 点击对话框外部关闭对话框
document.getElementById('addCategoryModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeAddCategoryModal();
    }
});

// 初始化
loadData(); 