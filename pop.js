console.log('Script running');

const authBtn = document.getElementById('authBtn');
const authInput = document.getElementById('authInput');



console.log('authBtn',authBtn)
console.log('authInput',authInput)



// 页面加载时，首先检查是否已经验证过
document.addEventListener('DOMContentLoaded', function() {
    const authBtn = document.getElementById('authBtn');
    const authInput = document.getElementById('authInput');

    // 首先检查存储中的验证状态
    chrome.storage.local.get(['isVerified'], function(result) {
        console.log('Checking verification status:', result);
        
        if (result.isVerified) {
            document.getElementById('authSection').style.display = 'none';

            // 如果已验证，直接显示主面板
            mainPanel.style.display = 'block !important'
            mainPanel.classList.add('show-important');
        }
    });

    // 验证按钮点击事件
    authBtn.addEventListener('click', function() {
        console.log('authInput.value:', authInput.value);
        if (authInput.value === '123456') {
            document.getElementById('authSection').style.display = 'none';
            // 显示主面板
            mainPanel.style.display = 'block !important'
            mainPanel.classList.add('show-important');
            console.log('block')
            // 保存验证状态
            chrome.storage.local.set({ isVerified: true }, function() {
                console.log('Verification status saved');
            });
        } else {
            authInput.value = '';
        }
    });
});