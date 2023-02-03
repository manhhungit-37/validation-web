const inputs = document.querySelectorAll('input');
const form = document.querySelector("#myForm");
const STRING_INPUTS = ['text', 'email', 'password', 'search', 'tel', 'url', 'textarea'];
const DATE_INPUTS = ['date', 'time', 'month', 'datetime', 'datetime-local', 'week'];
const error = {};

function getValueAndMessage(item) {
  return {
    value: typeof item === 'object' && item.value ? item.value : item,
    message: typeof item === 'object' && item.message ? item.message : '',
  }
};

function validateField({ type, value, name }, fieldData) {
  const { "jslancer-type": jslancerType, jslancerRequired, jslancerMaxLength, jslancerMinLength, "jslancer-min": jslancerMin, "jslancer-max": jslancerMax } = fieldData;

  if ((jslancerMin || jslancerMax) && !STRING_INPUTS.includes(jslancerType)) {
    let exceedMax;
    let exceedMin;
    const valueNumber = parseFloat(value);

    const { value: maxValue, message: maxMessage } = getValueAndMessage(jslancerMax);
    const { value: minValue, message: minMessage } = getValueAndMessage(jslancerMin);

    if (type === "number") {
      exceedMax = maxValue && valueNumber > maxValue;
      exceedMin = minValue && valueNumber < minValue;
    }
    else if (DATE_INPUTS.includes(type)) {
      if (typeof maxValue === 'string')
          exceedMax = maxValue && new Date(value) > new Date(maxValue);
      if (typeof minValue === 'string')
          exceedMin = minValue && new Date(value) < new Date(minValue);
    }

    if (exceedMax || exceedMin) {
        error[name] = Object.assign({}, error[name], { type: exceedMax ? 'max' : 'min', message: exceedMax ? maxMessage : minMessage });
        return error;
    }
  }
}

function getAttributes(e) {
  e.preventDefault();
  if (inputs.length > 0) {
    inputs.forEach((input) => {
      const validationAttrs = {};
      const attributes = [...input.attributes];
      if (attributes.length > 0) {
        attributes.forEach(attribute => {
          if (attribute.name.includes('jslancer') && attribute.name.includes('message')) {
            const newName = attribute.name.replace("-message", "");
            validationAttrs[newName] = {
              ...validationAttrs[newName],
              message: attribute.value,
            }
          }

          if (attribute.name.includes('jslancer') && !attribute.name.includes('message')) {
            validationAttrs[attribute.name] = {
              ...validationAttrs[attribute.name],
              value: attribute.value,
            }
          }
        })
      }

      if (Object.keys(validationAttrs).length > 0) {
        validateField(input, validationAttrs);
      }
    })
  }
}

form.addEventListener("submit", getAttributes);