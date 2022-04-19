import React from 'react';

export default function formFieldInit(value, rdmoContext, item) {
    console.log('\nformFieldInit | value ', value, ' | item ');
    let val = value.text;
    if (rdmoContext.form_data[item.key] !== undefined) {
        console.log('\tassign val from context | ', rdmoContext.form_data[item.key]);
        val = rdmoContext.form_data[item.key].value;
    } else if (rdmoContext.form_data[item.key] === undefined && value.text !== undefined) {
        console.log('\tadd to context at [', item.key, ']', {
            'value': value.text, 'valueId': value.id, 'question': item
        });
        rdmoContext.form_data[item.key] = {
            'value': value.text, 'valueId': value.id, 'question': item
        };
    }
    console.log('\treturn val ', val);
    return val;
}

// TODO: first checkbox only
export function formFieldCheckBoxInit(valueMap, rdmoContext, item, option) {
    // console.log('\nformFieldCheckBoxInit | valueMap ', valueMap, ' | item ', item, ' option ', option);
    let value = valueMap[option.id];
    let val = option.text;
    const itemKey = `checkbox_${item.key}_${option.id}`
    // if (rdmoContext.form_data[itemKey] !== undefined) {
    //     val = rdmoContext.form_data[item.key].value;
    // } else if (rdmoContext.form_data[item.key] === undefined &&) {
    // }
    if (rdmoContext.form_data[itemKey] === undefined && value !== undefined) {
        // console.log('\tadd to context at [', itemKey, ']', {
        //     'value': option.text, 'valueId': value.id, 'question': item, 'option': option.id,
        // });
        rdmoContext.form_data[itemKey] = {

            'value': option.text, 'valueId': value.id, 'question': item, 'option': option.id,
        };
    }
    return val;
}

export function markFormFieldMandatory(item) {
    // TODO: alternatively add a icon (or keep the asterisk) and add a small tooltip stating "mandatory field".
    let headerText = (<h5>{item.text_en} <i className="mdi mdi-asterisk mandatory"></i></h5>);

    let helpText = (<small id={`help_${item.key}`} className="form-text text-muted">
        <span className="mandatory">(This field is mandatory)</span>
    </small>);
    if (item.help_en) {
        helpText = `${item.help_en} (This field is mandatory)`;
        helpText = (<small id={`help_${item.key}`} className="form-text text-muted">
            {item.help_en}<span className="mandatory">(This field is mandatory)</span>
        </small>);
    }
    if (item.is_optional) {
        headerText = (<h5>{item.text_en}</h5>);
        helpText = item.help_en;
    }
    return {headerText, helpText};
}
