const fs = require('fs');

fs.readFile("./op.js", "utf8" ,(err,data) => {
    if (err) {
        console.error(err)
        return
      }
    const dataJson = JSON.parse(data.substring(13,data.length));
    let readMe = `# Blind Test

Bonjour est bienvenue sur mon blind test anime!
    
## Push
    
Les commits des nouveaux animes utilise cette template:
\`\`\`bash
git commit -am "add [Nom anime]"
\`\`\`

## Liste animes`

    for (const [key, value] of Object.entries(dataJson)) {
        readMe+=`- ${key}\n`;
    }

    fs.writeFile('./readme.md', readMe, err => {
        if (err) {
            console.error(err)
            return
        }
    })
})

