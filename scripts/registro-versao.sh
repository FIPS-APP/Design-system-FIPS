#!/usr/bin/env bash
# Pergunta ao registro se a versão do package.json já foi publicada e grava
# `ja_publicada=true|false` em $GITHUB_OUTPUT (entrada de scripts/publicar-decisao.mjs).
# Só "não existe" (E404) vira `false`. Qualquer outro erro do `npm view` (rede, 401, 403)
# falha o passo com a mensagem do npm, para não tentar publicar por engano.
# NOME e VERSAO vêm do ambiente; sem eles, do package.json. Teste: npm run test:publicar.
set -u

NOME="${NOME:-$(node -p "require('./package.json').name")}"
VERSAO="${VERSAO:-$(node -p "require('./package.json').version")}"
ERRO="$(mktemp)"
trap 'rm -f "$ERRO"' EXIT

if SAIDA=$(npm view "$NOME@$VERSAO" version 2>"$ERRO"); then
  if [ -n "$SAIDA" ]; then
    echo "ja_publicada=true" >> "$GITHUB_OUTPUT"
  else
    echo "ja_publicada=false" >> "$GITHUB_OUTPUT"
  fi
elif grep -q E404 "$ERRO"; then
  echo "ja_publicada=false" >> "$GITHUB_OUTPUT"
else
  echo "::error::Não foi possível consultar $NOME@$VERSAO no registro."
  cat "$ERRO"
  exit 1
fi
