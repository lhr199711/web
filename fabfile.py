from fabric.api import run, env, local, hosts, cd

ROOT_DIR = '/home/test/server/front-end/adt'
SOURCE_DIR = '/home/test/server/front-end/adt/fresh'
def test():
    print('hello...')
    if not run('test -d %s && echo 1' % ROOT_DIR):
        run('mkdir %s' % ROOT_DIR)
    if not run('test -d %s && echo 1' % SOURCE_DIR):
        run('git clone git@code.lukou.com:develop/lannister.git %s' % SOURCE_DIR)
    with cd(SOURCE_DIR):
        run('git pull origin master')
        run('yarn install')
        run('yarn build')
    print('end...')
