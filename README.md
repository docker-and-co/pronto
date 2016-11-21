# Pronto

## About
[Pronto](https://github.com/mmozuras/pronto)

> Pronto runs analysis quickly by checking only the relevant changes. 
> Created to be used on GitHub pull requests, but also works locally 
> and integrates with **GitLab** and Bitbucket.

This service aims to do automated ~~code review~~ linting

![pronto gif](https://github.com/mmozuras/pronto/raw/master/pronto.gif)

## Usage

1. Create linter user in gitlab
2. Setup runner and use linter api token or use directly image name (insecure)
3. Setup ci

### Direct image usage

```yml
job-lint:
  image: pronto
  stage: lint
  except:
    - master
  script:
### lines bellow will run
#    - npm install --color always --loglevel=warn > /dev/null # need when eslint require other libs
# #   - composer install # except this
#    - env PATH=$PATH:./node_modules/.bin/:/root/.composer/vendor/bin pronto-gitlab -c origin/master
```

### After Setup runner

```yml
job-lint:
  tags:
   - pronto
  stage: lint
  except:
    - master
  script:
### what you desire
#    - npm install --color always --loglevel=warn > /dev/null # need when eslint require other libs
#    - composer install
#    - env PATH=$PATH:./node_modules/.bin/:/root/.composer/vendor/bin pronto-gitlab -c origin/master
```

[gitlab executors entrypoint](https://gitlab.com/gitlab-org/gitlab-ci-multi-runner/blob/master/docs/executors/docker.md#the-entrypoint)
> The Docker executor doesn't overwrite the ENTRYPOINT of a Docker image.  
> That means that if your image defines the ENTRYPOINT and doesn't allow to run scripts with CMD, the image will not work with the Docker executor.  
> With the use of ENTRYPOINT it is possible to create special Docker image that would run the build script in a custom environment, or in secure mode.  
> You may think of creating a Docker image that uses an ENTRYPOINT that doesn't execute the build script, but does execute a predefined set of commands, for example to build the docker image from your directory. In that case, you can run the build container in privileged mode, and make the build environment of the Runner secure.  

You can build your own docker image base on this one and in that way inject
GITLAB_API_ENDPOINT and GITLAB_API_PRIVATE_TOKEN directly in the 
(entry point script)[/pronto-gitlab]  
Or use project env vars.
Both ways are secure because of [using docker entrypoint](https://docs.docker.com/engine/reference/builder/#/entrypoint)
 and [gitlab execute strategy (comment above)](https://gitlab.com/gitlab-org/gitlab-ci-multi-runner/blob/master/docs/executors/docker.md#the-entrypoint)

Again in case *build your own image*: don't forget add *ENTRYPOINT* at your *Dockerfile*
or *GITLAB_API_PRIVATE_TOKEN* can be stolen. Don't care if you trust your team.