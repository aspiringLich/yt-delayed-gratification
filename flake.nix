{
  description = "A Nix flake for web extension development";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          # List of packages available in the development shell
          packages = with pkgs; [
            nodejs # or specify a specific version
            pnpm
            web-ext
          ];
        };
      }
    );
}
