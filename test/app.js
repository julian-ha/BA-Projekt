

const delay = async(ms) => {
    new Promise(resolve => setTimeout(resolve, ms))
}

const x = async () => {
    console.log('starting with the while loop');
        setInterval(() => {
            console.log('test');
        }, 5000)
}

x();