export const convertDate = (timestamp, hideDate = false) => {
  const pubDate = new Date(timestamp * 1000)
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']

  let result = (pubDate.getHours() < 10 ? '0' : '') + pubDate.getHours() + ':' + (pubDate.getMinutes() < 10 ? '0' : '') + pubDate.getMinutes()

  if (!hideDate) {
    result = result + ', ' + pubDate.getDate() + ' ' + months[pubDate.getMonth()] + ' ' + pubDate.getFullYear()
  }

  return result
}

export const convertTimestamp = (timestamp) => {
  const a = new Date(timestamp * 1000)
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
  const year = a.getFullYear()
  const month = months[a.getMonth()]
  const date = a.getDate()
  const hour = a.getHours()
  const min = a.getMinutes()
  const sec = a.getSeconds()
  const time = (hour < 10 ? '0' : '') + hour + ':' + (min < 10 ? '0' : '') + min
  return time
}

export const convertText = (text) => {
  const maxLength = 300
  let formattedText = text.replace(/<\/?[^>]+(>|$)/g, '')

  if (formattedText.length > maxLength) {
    formattedText = formattedText.substring(0, maxLength) + '...'
  }

  formattedText = formattedText.split('The post')
  formattedText = formattedText[0]
  formattedText = formattedText.trim()
  formattedText = formattedText.replace(/<(?:.|\n)*?>/gm, '')
  formattedText = formattedText.split(/&#34;/g).join('"')
    .split(/&#39;/g).join('\'')
    .split(/&#039;/g).join('\'')
    .split(/&#8211;/g).join('-')
    .split(/&#8216;/g).join('\'')
    .split(/&#8217;/g).join('\'')
    .split(/&#8219;/g).join('\'')
    .split(/&#8220;/g).join('"')
    .split(/&#8221;/g).join('"')
    .split(/&#13;/g).join('')
    .split(/&#160;/g).join(' ')
    .split(/&#8230;/g).join('...')
    .split(/&#quot;/g).join('"')

  return formattedText
}

export const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
};
