from setuptools import setup

setup(name='soliddata',
      version='0.0.1',
      description='Test data generation for little-sister app',
      author='Justas Azna',
      author_email='root@reederz.com',
      packages=['soliddata'],
      scripts=['bin/soliddata'],
      install_requires=['rdflib'],
      )
