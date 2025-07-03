export const isEven = (number) => {
    const result = number % 2

    return result === 0
}

export const doSomeOnEven = (number, cb) => {
    if(!isEven(number)) {
        return 
    }

    cb()
}