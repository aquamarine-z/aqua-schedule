export function saveStringToFile(filename: string, content: string) {
    const blob = new Blob([content], {type: "text/plain"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export async function loadImagesBase64() {
    return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*"; // 仅允许选择图片
        input.multiple = true; // 允许多选
        input.onchange = async (event) => {
            const fileInput = event.target;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const files = fileInput.files;

            if (!files || files.length === 0) {
                reject(new Error("未选择图片"));
                return;
            }

            try {
                const base64Images = [];
                for (const file of files) {
                    const base64 = await readFileAsDataURL(file);
                    base64Images.push(base64);
                }
                resolve(base64Images);
            } catch (error) {
                reject(error);
            }
        };

        input.click(); // 触发文件选择对话框
    });
}

function readFileAsDataURL(file: Blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

export function isBase64Image(str: string): boolean {
    return str?.startsWith("data:image/");
}

