const form = document.getElementById("search-form");
const input = document.getElementById("username");
const result = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = input.value.trim();
  if (!username) return;

  result.innerHTML = "";

  result.innerHTML = `<p class="message">Buscando perfil...</p>`;

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) throw new Error("Usuário não encontrado");

    const user = await userRes.json();

    const reposRes = await fetch(user.repos_url);
    const repos = await reposRes.json();

    result.innerHTML = `
  <div class="profile">
    <img src="${user.avatar_url}" alt="Avatar de ${user.login}" />
    <div class="profile-info">
      <h2>${user.name || user.login}</h2>
      <p>${user.bio || "Sem bio disponível"}</p>
      <div class="stats">
        <span>👥 ${user.followers} seguidores</span>
        <span>📦 ${user.public_repos} repositórios</span>
      </div>
    </div>
  </div>

  <div class="repos">
    <h3>Repositórios em destaque</h3>
    <ul>
      ${repos
        .slice(0, 5)
        .map(
          (repo) =>
            `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`
        )
        .join("")}
    </ul>
  </div>
`;
  } catch (err) {
    result.innerHTML = `<p>${err.message}</p>`;
  }
});
