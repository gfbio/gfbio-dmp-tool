from django import template

register = template.Library()

@register.filter
def get(dictionary, key):
    """Get an item from a dictionary."""
    if dictionary is None:
        return None
    try:
        return dictionary.get(key)
    except (AttributeError, TypeError):
        return None
