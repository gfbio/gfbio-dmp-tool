export default function isTargetOptionInInputs(_inputs, condition) {
    let result = false;
    Object.keys(_inputs).forEach((key) => {
        if (_inputs[key] === `${condition.target_option_id}`) {
            result = true;
        }
    });
    return result;
}
