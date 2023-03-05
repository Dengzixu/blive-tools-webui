export default {
    saveBlob(filename, blob) {
        return new Promise((resolve, reject) => {
            // 创建一个 a 标签用于下载
            const a = document.createElement('a')

            // 设置这个标签不可见
            a.style.display = 'none';

            // 设置下载目标文件吗
            a.setAttribute('download', filename);

            // 创建 URL
            let objectFileURL = window.URL.createObjectURL(blob);

            // 给标签设置 URL
            a.href = objectFileURL;

            // 开始下载
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // 及时回收资源
            // 原因 : https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL#%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86
            window.URL.revokeObjectURL(objectFileURL);

            resolve();
        })
    }
}