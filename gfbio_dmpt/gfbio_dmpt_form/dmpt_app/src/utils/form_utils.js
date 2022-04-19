import React from 'react';

export default function formFieldInit(value, rdmoContext, item) {
    let val = value.text;
    if (rdmoContext.form_data[item.key] !== undefined) {
        val = rdmoContext.form_data[item.key].value;
    } else if (rdmoContext.form_data[item.key] === undefined && value.text !== undefined) {
        rdmoContext.form_data[item.key] = {
            'value': value.text, 'valueId': value.id, 'question': item
        };
    }
    return val;
}

// TODO: first checkbox only
// export function formFieldListInit(valueList, rdmoContext, item){
//     let val = valueList;
//     if (rdmoContext.form_data[item.key] !== undefined) {
//         val = rdmoContext.form_data[item.key];
//     } else if (rdmoContext.form_data[item.key] === undefined && valueList !== undefined) {
//         rdmoContext.form_data[item.key] = {
//             'value': value.text, 'valueId': value.id, 'question': item
//         };
//     }
//     return val;
// }

export function markFormFieldMandatory(item) {
    // TODO: alternatively add a icon (or keep the asterisk) and add a small tooltip stating "mandatory field".
    let headerText = (<h5>{item.text_en} <i className="mdi mdi-asterisk mandatory"></i></h5>);

    let helpText = (<small id={`help_${item.key}`} className='form-text text-muted'>
        <span className="mandatory">(This field is mandatory)</span>
    </small>);
    if (item.help_en) {
        helpText = `${item.help_en} (This field is mandatory)`;
        helpText = (<small id={`help_${item.key}`} className='form-text text-muted'>
            {item.help_en}<span className="mandatory">(This field is mandatory)</span>
        </small>);
    }
    if (item.is_optional) {
        headerText = (<h5>{item.text_en}</h5>);
        helpText = item.help_en;
    }
    return {headerText, helpText};
}
