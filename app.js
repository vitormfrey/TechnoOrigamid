const vm = new Vue({
  el:'#app',
  data:{
    produtos: [],
    produto: false,
    carrinho:[],
    carrinhoAtivo: false,
    mensagemAlerta:'Item adicionado',
    alertaAtivo: false,
  },

  filters:{
    numeroPreco(valor){
      // console.log(valor)
      return valor.toLocaleString("pt-br", {style: 'currency', currency:'BRL'})
      //Filtrar valores
    }
  },

  computed:{
    carrinhoTotal(){
      let total = 0;

      if(this.carrinho.length > 0){
        this.carrinho.forEach(valor =>{
          // console.log(valor)
          total += valor.preco 
        })
      }       
      return total
    }
  },

  methods:{
    fetchProdutos(){
      fetch("./api/produtos.json")
      .then(r => r.json())
      .then(r =>{
        this.produtos = r;
      })
    },    

    fetchProduto(id){
      fetch(`./api/produtos/${id}/dados.json`) //ID é o parametro como que no caso tem o mesmo nome das pastas
      .then(r => r.json())
      .then(r =>{
        this.produto = r
      })
    },

    abrirModal(id){
      this.fetchProduto(id)
      window.scrollTo({
        top: 0,
        behavior: 'smooth', 
      })
    },

    fecharModal({target, currentTarget}){
      if(target === currentTarget)
        this.produto = false
    },

    clickForaCarrinho({target, currentTarget}){
      if(target === currentTarget)
        this.carrinhoAtivo = false
    },

    adicionarItem(){
      this.produto.estoque--
      const {id, nome, preco} = this.produto
      this.carrinho.push({id, nome, preco})
      this.alerta(`${nome} adicionado ao carrinho`)
    },
    removerItem(index){
      this.carrinho.splice(index, 1)
    },
    checarLocalStorage(){
      if(window.localStorage.carrinho){
        this.carrinho = JSON.parse(window.localStorage.carrinho)
      }
    },

    compararEstoque(){
      this.carrinho.filter(item =>{
        console.log(item)
      })    
    },

    alerta(mensagem){
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true;
      setTimeout(()=>{
        this.alertaAtivo = false
      }, 1500);
    },     
    router(){
      const hash = document.location.hash
      // console.log(hash)
      if(hash){
        this.fetchProduto(hash.replace('#', ""))
      }
    }
  },

  watch:{
    carrinho(){
      window.localStorage.carrinho = JSON.stringify(this.carrinho)//passo o Arry pra uma string, assim salva
    },
    produto(){
      document.title = this.produto.nome || 'Techno'
      const hash = this.produto.id || ""
      history.pushState(null, null, `#${hash}`)

      if(this.produto){
        this.compararEstoque()
      }

    }
  },


  created(){
    this.fetchProdutos();
    this.checarLocalStorage();
    this.router();
  }
})