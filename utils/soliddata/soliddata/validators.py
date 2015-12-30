from jsonschema import validate


class NotUniqueError(Exception):
    pass


def validate_blueprint(blueprint):
    '''Validate test data blueprint

    If the blueprintt is valid, nothing happens. Otherwise the
    method raises ValidationError

    :raises: ValidationError, NotUniqueError
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
    # Check agains json schema
    validate(blueprint, schema)

    # Check if all the server names are unique
    server_names = map(lambda s: s['name'], blueprint['servers'])
    if len(server_names) != len(set(server_names)):
        raise NotUniqueError('server names are not unique')

    # Check if all the people ids are unique
    people_ids = reduce(lambda acc_ids, server: acc_ids + map(lambda p: p['id'],
                                                              server['people']),
                        blueprint['servers'], [])
    if len(people_ids) != len(set(people_ids)):
        raise NotUniqueError('people ids are not unique')
