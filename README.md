# visa2p61
Course Webpage

### generating DAGs from student assignment repos:
first clone all repos into ~/visa2p61/a1 (or a2, etc):

```shell
for url in \
  https://github.com/kyliemcneil06-cmd/a1-git-labyrinth \
  https://github.com/DocSam-44/a1-git-labyrinth \
  https://github.com/linr5662/a1-git-labyrinth1 \
  https://github.com/Lanaalsaleh/a1-git-labyrinth \
  https://github.com/t7ru/a1-git-labyrinth \
  https://github.com/1mchughhal/a1-git-labyrinth \
  https://github.com/yasminelgerf/a1-git-labyrinth \
  https://github.com/jadeb2158-jpg/a1-git-labyrinth \
  https://github.com/singufridge/a1-git-labyrinth \
; do
  username=$(echo "$url" | cut -d'/' -f4)
  git clone --no-single-branch "$url" "$username"
done
```

then run inside this folder in VS code:
```shell 
node DAG.js --repos ../visa2p61-repos/a1
```