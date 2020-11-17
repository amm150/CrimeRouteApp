import spanishTranslations from '../../translations/spanish';
import englishTranslations from '../../translations/english';

function translate(key) {
    // Hard coding this for now, need to update it to grab the user's lang
    const lang = 'english';

    let translation;

    switch(lang) {
        case 'english':
            translation = englishTranslations[key];
            break;
        
        case 'spanish':
            translation = spanishTranslations[key];
            break;

        default: 
            translation = key;
    }

    return translation;
}

export default translate;