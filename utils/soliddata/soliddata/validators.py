from jsonschema import validate


class ValidationError(Exception):
    pass


def validate_blueprint(blueprint):
    '''Validate test data blueprint

    If the blueprintt is valid, nothing happens. Otherwise the
    method raises ValidationError

    :raises: ValidationError
    '''

    person_schema = {
        'type': 'object',
        'additionalProperties': False,
        'properties': {
            'id': {'type': 'string'},
            'name': {'type': 'string'},
            'description': {'type': 'string'},
            'sensors': {
                'type': 'array',
                'items': {'type': 'string'}
            },
            'friends': {
                'type': 'array',
                'items': {'type': 'string'}
            },
            'links': {
                'type': 'array',
                'items': {'type': 'string'}
            },
        }
    }
    resource_schema = {
        'type': 'object',
        'additionalProperties': False,
        'properties': {
            'id': {'type': 'string'},
            'name': {'type': 'string'},
            'description': {'type': 'string'},
            'type': {'type': 'string'},
            'links': {
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
                    'additionalProperties': False,
                    'properties': {
                        'name': {'type': 'string'},
                        'location': {'type': 'string'},
                        'people': {
                            'type': 'array',
                            'items': person_schema
                        },
                        'resources': {
                            'type': 'array',
                            'items': resource_schema
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
        raise ValidationError('server names are not unique')

    # Check if all the people ids are unique
    people_flattened = reduce(lambda acc_ids, server: acc_ids +
                              server['people'] if 'people' in server else [],
                              blueprint['servers'], [])

    people_ids = map(lambda p: p['id'], people_flattened)
    if len(people_ids) != len(set(people_ids)):
        raise ValidationError('people ids are not unique')

    for p in people_flattened:
        if len(p['friends']) != len(set(p['friends'])):
            raise ValidationError('friends ids are not unique')

        for f in p['friends']:
            if f == p['id']:
                err = 'cannot have self referencial friend connection'
                raise ValidationError(err)
            if f not in people_ids:
                raise ValidationError('{} does not exist'.format(f))

    # Check if all the resource ids are unique
    resources_flattened = reduce(lambda acc_ids, server: acc_ids +
                                 server['resources']
                                 if 'resources' in server else [],
                                 blueprint['servers'], [])

    resource_ids = map(lambda p: p['id'], resources_flattened)
    if len(resource_ids) != len(set(resource_ids)):
        raise ValidationError('resource ids are not unique')
