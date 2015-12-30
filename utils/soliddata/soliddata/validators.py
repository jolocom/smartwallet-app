from jsonschema import validate


def validate_blueprint(blueprint):
    '''Validate test data blueprint

    If the blueprintt is valid, nothing happens. Otherwise the
    method raises ValidationError

    :raises: ValidationError
    '''

    person_schema = {
        'type': 'object',
        'properties': {
            'id': {'type': 'string'},
            'name': {'type': 'string'},
            'description': {'type': 'string'},
            'friends': {
                'type': 'array',
                'items': {'type': 'string'}
            },
        }
    }
    schema = {
        'type': 'object',
        'properties': {
            'servers': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'name': {'type': 'string'},
                        'location': {'type': 'string'},
                        'people': {
                            'type': 'array',
                            'items': person_schema
                        }
                    }
                }
            }
        }
    }
    validate(blueprint, schema)
