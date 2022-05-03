import React, { useContext, useState } from 'react';

import PropTypes from 'prop-types';
import RdmoContext from '../RdmoContext';
import formFieldInit, {
    formFieldCheckBoxInit,
    markFormFieldMandatory,
} from '../../utils/form_utils';

function FormCheckBox(props) {
    const { item, options, value, handleChange, handleCheck } = props;
    const rdmoContext = useContext(RdmoContext);

    // let val = -1;
    // const val = formFieldInit(value, rdmoContext, item);
    // console.log('val ', val);
    const valueMap = {};
    value.map((v) => {
        valueMap[v.option] = v;
        return true;
    });
    // console.log('valueMap ', valueMap);

    const { headerText, helpText } = markFormFieldMandatory(item);

    // FIXME: Re-render hell when used in conjunction with form init
    // const [checkCount, setCheckCount] = useState(0);

    const handleCheckBoxChange = (e, i, optionId) => {
        console.log('\n----\nFormCheckBox | value ', value);
        console.log(
            '| handleCheckBoxChange | optionID  ',
            optionId,
            ' | i ',
            i
        );
        console.log('checked ', e.target.checked);
        // value = value.map((e, index) => {
        //     console.log(' e ', e, ' index: ', index);
        //     if (e.option === optionId) {
        //         ;
        //     }
        //     else {
        //         return e;
        //     }
        // });
        if (e.target.checked) {
            // setCheckCount(checkCount + 1);
            console.log('checked if');
        } else {
            // setCheckCount(checkCount - 1);
            console.log('checked else');
        }
        // delete valueMap[optionId];
        handleCheck(value, optionId);
        e.optionId = optionId;
        handleChange(e, i);
    };

    // TODO: mandatory/required fields are treated this way: if no box is ticked and field is mandatory the required
    //  attribute is set, thus preventing successful form validation, if at least on box is ticked the requirement is fulfilled
    //  this may need to be extended to deal with checkboxes where a check is mandatory, e.g. agree to tos ...
    return (
        <div className="form-group" key={item.id}>
            <label htmlFor={item.key}>
                {headerText}
                {helpText}
            </label>
            {options.map((i, index) => {
                const val = formFieldCheckBoxInit(
                    valueMap,
                    rdmoContext,
                    item,
                    i
                );
                // console.log('\tFormCheckBox | map options | option ', i);
                // console.log('\tFormCheckBox | map options | option.text: ', i.text, ' | option.id ', i.id, ' | option.checked ', i.checked);
                // console.log('checcount ', checkCount);
                // value map is a rdmo value referfing to question
                // if option.id == valueMap[option.id].option, then it is checked

                // if (i.text === val) {
                // if (i.checked) {
                // if(Object.keys().indexOf(i.id) >= 0){

                if (
                    valueMap[i.id] &&
                    valueMap[i.id].option &&
                    i.id === valueMap[i.id].option
                ) {
                    //     setCheckCount(checkCount + 1);

                    if (item.is_optional) {
                        // || checkCount > 0
                        return (
                            <div className="form-check" key={i.id}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name={`checkbox_${item.key}_${i.id}`}
                                    value={i.text}
                                    onChange={(e) =>
                                        handleCheckBoxChange(e, item, i.id)
                                    }
                                    id={`${item.key}_${i.id}`}
                                    checked
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor={`checkbox_${item.key}_${i.id}`}
                                >
                                    {i.text}
                                </label>
                            </div>
                        );
                    }
                    return (
                        <div className="form-check" key={i.id}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name={`checkbox_${item.key}_${i.id}`}
                                value={i.text}
                                onChange={(e) =>
                                    handleCheckBoxChange(e, item, i.id)
                                }
                                id={`${item.key}_${i.id}`}
                                checked
                                required
                            />
                            <label
                                className="form-check-label"
                                htmlFor={`checkbox_${item.key}_${i.id}`}
                            >
                                {i.text}
                            </label>
                        </div>
                    );
                }
                if (item.is_optional) {
                    // || checkCount > 0
                    return (
                        <div className="form-check" key={i.id}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name={`checkbox_${item.key}_${i.id}`}
                                value={i.text}
                                onChange={(e) =>
                                    handleCheckBoxChange(e, item, i.id)
                                }
                                id={`${item.key}_${i.id}`}
                            />
                            <label
                                className="form-check-label"
                                htmlFor={`checkbox_${item.key}_${i.id}`}
                            >
                                {i.text}
                            </label>
                        </div>
                    );
                }
                return (
                    <div className="form-check" key={i.id}>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            name={`checkbox_${item.key}_${i.id}`}
                            value={i.text}
                            onChange={(e) =>
                                handleCheckBoxChange(e, item, i.id)
                            }
                            id={`${item.key}_${i.id}`}
                            required
                        />
                        <label
                            className="form-check-label"
                            htmlFor={`checkbox_${item.key}_${i.id}`}
                        >
                            {i.text}
                        </label>
                    </div>
                );
            })}
        </div>
    );
}

FormCheckBox.defaultProps = {
    value: '',
};

FormCheckBox.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    item: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    options: PropTypes.object.isRequired,
    value: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
};

export default FormCheckBox;
