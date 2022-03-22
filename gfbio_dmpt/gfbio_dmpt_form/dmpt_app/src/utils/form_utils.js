import React from 'react';

export default function formFieldInit(value, rdmoContext, item) {
    let val = value.text;
    if (rdmoContext.form_data[item.key] !== undefined) {
        val = rdmoContext.form_data[item.key].value;
    } else if (rdmoContext.form_data[item.key] === undefined && value.text !== undefined) {
        rdmoContext.form_data[item.key] = {
            'value': value.text,
            'valueId': value.id,
            'question': item
        };
    }
    return val;
}

export function markFormFieldMandatory(item) {
    // TODO: alternatively add a icon (or keep the asterisk) and add a small tooltip stating "mandatory field".
    let headerText = (<h5>{item.text_en} <b>*</b></h5>);

    let helpText = '(This field is mandatory)';
    if (item.help_en) {
        helpText = `${item.help_en} (This field is mandatory)`;
    }
    if (item.is_optional) {
        headerText = (<h5>{item.text_en}</h5>);
        helpText = item.help_en;
    }
    return { headerText, helpText};
}
