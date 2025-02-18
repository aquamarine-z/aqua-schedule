export function saveStringToFile(filename: string, content: string) {
    const blob = new Blob([content], {type: "text/plain"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export async function loadImageBase64() {
    return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*"; // 仅允许选择图片

        input.onchange = (event) => {
            const fileInput = event.target as HTMLInputElement; // 这里添加类型断言
            const file = fileInput.files?.[0]; // 访问 `files`
            if (!file) {
                reject(new Error("未选择图片"));
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        };

        input.click(); // 触发文件选择对话框
    });
}


export function isBase64Image(str: string): boolean {
    return str?.startsWith("data:image/");
}

