// __tests__/GithubCard.test.tsx
import { render, screen } from '@testing-library/react';
import GithubCard from './GithubCard';

describe('GithubCard', () => {
  it('toggles expanded state on button click', () => {
    const toggleUser = jest.fn();
    render(
      <GithubCard
        user={{ login: "octocat", id: 1, avatar_url: "https://avatars.githubusercontent.com/octocat" }}
        toggleUser={toggleUser}
        expanded={null}
        repos={{}}
        loadingRepos={null}
      />
    );
    const button = screen.getByRole('button');
    button.click();
    expect(toggleUser).toHaveBeenCalledWith("octocat");
  });
});