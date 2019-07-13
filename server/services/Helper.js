import moment from 'moment';

export default class helper {
    static makePayload(title = "Title", body = "This is the body", data = {
        link: "/link",
        props: JSON.stringify({})
    }) {
        if (data.props == null) {
            data.props = '';
        }

        if (typeof(data.props) != 'string') {
            data.props = JSON.stringify(data.props);
        }

        if (data.link == null || typeof(data.link) != 'string') {
            data.link = '';
        }

        return {
            notification: {
                title: title,
                body: body
            },
            data: data
        }
    }

    static generatePassword(length){
        let password = ''
        let alphabets = 'qwertyuioplkjhgfdsazxcvbnm1234567890';
        for(let i = 0;i<length;i++){
            const index = Math.floor(Math.random() * (alphabets.length-1));
            password += alphabets[index];
        }
        return password
    }
}