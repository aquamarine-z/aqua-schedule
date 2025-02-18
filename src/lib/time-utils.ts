export function formatWeeks(weeks: number[]) {
    if (!Array.isArray(weeks) || weeks.length === 0) {
        return '';
    }

    // 对数组进行排序
    weeks.sort((a, b) => a - b);

    const result = [];
    let start = weeks[0];
    let end = weeks[0];

    for (let i = 1; i < weeks.length; i++) {
        if (weeks[i] === end + 1) {
            // 当前数字与前一个数字连续
            end = weeks[i];
        } else {
            // 当前数字与前一个数字不连续
            if (start === end) {
                result.push(`${start}`);
            } else {
                result.push(`${start}~${end}`);
            }
            start = weeks[i];
            end = weeks[i];
        }
    }

    // 处理最后的区间
    if (start === end) {
        result.push(`${start}`);
    } else {
        result.push(`${start}~${end}`);
    }

    return result.join(',');
}

export function getAllDatesOfTheWeek(date: Date, n: number) {
    n -= 1
    // 复制传入的日期，避免修改原日期
    const current = new Date(date);
    // 获取当前日期的星期（0: 周日, 1: 周一, ...）
    const day = current.getDay();
    // 计算本周周一与当前日期的差值
    // 如果当前日期是周日（day === 0），则将其视为上一周的最后一天，差值为 -6
    const diffToMonday = (day === 0 ? -6 : 1 - day);
    // 计算出本周周一
    const monday = new Date(current);
    monday.setDate(current.getDate() + diffToMonday);

    // 将本周的周一加上 n 个星期（n*7 天）
    monday.setDate(monday.getDate() + n * 7);

    // 构造从周一到周日的日期数组
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        weekDates.push(d);
    }
    return weekDates;
}

export const dayChineseName = ["日", "一", "二", "三", "四", "五", "六"]