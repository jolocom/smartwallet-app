export const utf8ToBase64Image = (utf8: string): string => {
    return `data:image/png;base64,${Buffer.from(utf8).toString('base64')}`
}