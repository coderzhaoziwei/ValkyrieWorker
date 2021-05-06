# clear
echo "\033[2J"

yarn version --no-git-tag-version --patch

yarn rollup --config rollup/style.config.js

yarn rollup --config rollup/rollup.config.js

# copy
if (type pbcopy >/dev/null 2>&1) then
  pbcopy < bundle/valkyrie.user.js
  echo "\033[32mcopied \033[1;36mbundle/valkyrie.user.js \033[0;32mto clipboard.\033[0m"
else
  echo "\033[36mcommand not found: pbcopy\033[0m"
fi

# end
echo ""
